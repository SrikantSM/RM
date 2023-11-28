const https = require('https');
const url = require('url');

// https://wiki.wdf.sap.corp/wiki/display/HCPCoreOrg/Instance+Manager+Deprecation+and+Migration+to+Service+Manager

// get credentials
const vcap = JSON.parse(process.env.VCAP_SERVICES);
const im = vcap["managed-hana"][0].credentials;
const sm = vcap["service-manager"][0];

async function main() {
    // call IM migration endpoint on each tenant (bindings will be created on-demand by the client library)
    try {
        console.log('Migrating tenants from IM to SM');
        await migrateTenants();
    } catch (err) {
        console.error('Migration failed with error', err);
        process.exitCode = 1;
        return;
    }

    // We do not delete the bindings from the old Instance Manager instance here to reduce the risk of failure.
    // This will be done in later, manual activities after the (release) deployments.

    console.log('Migration from IM to SM successfully finished');
}

main();

/**
 * For every app-managed instance in an Instance Manager service instance execute a POST call on the <migrate_managed_instance_url>
 * specifying the app-managed service instance to migrate and the GUID of the service-manager instance the app-managed service instance
 * should be migrated to.
 */
async function migrateTenants() {
    const tenants = JSON.parse(await request(im.get_all_managed_instances_url, { method: 'GET', auth: im.user + ':' + im.password }));
    for (const tenant of tenants) {
        if (tenant.migration_status !== "NOT_YET_MIGRATED") continue;

        const url = im.migrate_managed_instance_url
            .replace("{tenant_id}", tenant.tenant_id)
            .replace("{service-manager_container_id}", sm.instance_guid);
        try {
            console.log(`Calling Migration Endpoint for tenant ${tenant.tenant_id}`);
            await request(url, { method: 'POST', auth: im.user + ':' + im.password });
            console.log(`Tenant ${tenant.tenant_id} successfully migrated`);
        } catch (err) {
            console.error(`Tenant ${tenant.tenant_id} failed with error`, err);
            console.log('Aborting loop across tenants due to error');
            throw err;
        }
    }
}

/**
 * Executes an HTTP request against a given URL
 * @param {string} urlString
 * @param {any} additionalOptions should at least contain the method information
 * @param {any} body will be sent to the server when set
 * @returns {Promise<string>} representing the HTTP response
 */
async function request(urlString, additionalOptions, body) {
    return new Promise((resolve, reject) => {
        const {
            protocol, path, hostname, port,
        } = url.parse(urlString, true);

        const options = {
            ...additionalOptions,
            host: hostname,
            path,
            port,
        };

        if (body !== null && body !== undefined) {
            options.headers = {
                ...options.headers,
                'Content-Length': body.length,
            };
        }
        console.log(`INFO: Sending ${additionalOptions.method} request of to ${urlString}`);
        const httpRequest = (protocol.startsWith('https') ? https : http).request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode < 300) {
                    console.log(`INFO: Request to ${urlString} succeeded with status code ${response.statusCode}`);
                    resolve(data);
                } else {
                    console.error(`ERROR: Request to ${urlString} failed with status code ${response.statusCode} and message '${data}'`);
                    const error = new Error(data);
                    error.status = response.statusCode;
                    reject(error);
                }
            });

            response.on('aborted', () => {
                console.error(`ERROR: Request to ${urlString} was aborted`);
                reject(new Error('aborted'));
            });
        });

        httpRequest.on('error', (err) => {
            reject(err);
        });

        if (body !== null && body !== undefined) {
            httpRequest.write(body);
        }

        httpRequest.end();
    });
}
