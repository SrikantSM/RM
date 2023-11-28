set NODE_TLS_REJECT_UNAUTHORIZED=0
set http_proxy=
set https_proxy=
set VCAP_SERVICES={
		"portal": [
			{
				"label": "portal",
				"provider": null,
				"plan": "standard",
				"name": "assignment-portal",
				"tags": [
					"cp",
					"portal",
					"portal-service"
				],
				"instance_name": "assignment-portal",
				"binding_name": null,
				"credentials": {
					"endpoints": {
						"portal-service": "https://portal-service.cfapps.sap.hana.ondemand.com"
					},
					"sap.cloud.service": "com.sap.ui.portal",
					"sap.cloud.service.alias": "cp",
					"saasregistryenabled": true,
					"html5-apps-repo": {
						"app_host_id": "c693e508-f8d5-4a70-be60-cb6106d0b60e,570d7b41-113a-469b-ae5f-7ba55967aed4,85cd3f98-4345-42bd-b425-364c144d0e0e,4fa102db-cd37-4ef7-8233-d286e8a017f6"
					},
					"uaa": {
						"uaadomain": "authentication.sap.hana.ondemand.com",
						"tenantmode": "dedicated",
						"sburl": "https://internal-xsuaa.authentication.sap.hana.ondemand.com",
						"clientid": "sb-ae392c71-bb34-45a4-a064-b44a4cb8c945!b5957|portal-cf-service!b119",
						"verificationkey": "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx/jN5v1mp/TVn9nTQoYVIUfCsUDHa3Upr5tDZC7mzlTrN2PnwruzyS7w1Jd+StqwW4/vn87ua2YlZzU8Ob0jR4lbOPCKaHIi0kyNtJXQvQ7LZPG8epQLbx0IIP/WLVVVtB8bL5OWuHma3pUnibbmATtbOh5LksQ2zLMngEjUF52JQyzTpjoQkahp0BNe/drlAqO253keiY63FL6belKjJGmSqdnotSXxB2ym+HQ0ShaNvTFLEvi2+ObkyjGWgFpQaoCcGq0KX0y0mPzOvdFsNT+rBFdkHiK+Jl638Sbim1z9fItFbH9hiVwY37R9rLtH1YKi3PuATMjf/DJ7mUluDQIDAQAB-----END PUBLIC KEY-----",
						"apiurl": "https://api.authentication.sap.hana.ondemand.com",
						"xsappname": "ae392c71-bb34-45a4-a064-b44a4cb8c945!b5957|portal-cf-service!b119",
						"identityzone": "rm-dev",
						"identityzoneid": "dc9b21b8-0188-4145-8cfe-1ec0a8d474fa",
						"clientsecret": "LqtPpu46AFNvltedWFCoVvTybac=",
						"tenantid": "dc9b21b8-0188-4145-8cfe-1ec0a8d474fa",
						"url": "https://rm-dev.authentication.sap.hana.ondemand.com"
					}
				},
				"syslog_drain_url": null,
				"volume_mounts": []
			}
		],
		"xsuaa": [
			{
				"label": "xsuaa",
				"provider": null,
				"plan": "application",
				"name": "assignment-uaa",
				"tags": [
					"xsuaa"
				],
				"instance_name": "assignment-uaa",
				"binding_name": null,
				"credentials": {
					"tenantmode": "dedicated",
					"sburl": "https://internal-xsuaa.authentication.sap.hana.ondemand.com",
					"clientid": "sb-assignment-excelsior_1!t5957",
					"xsappname": "assignment-excelsior_1!t5957",
					"clientsecret": "XEyuqaQBvG6gWjCbGpIES3yld8c=",
					"url": "https://rm-dev.authentication.sap.hana.ondemand.com",
					"uaadomain": "authentication.sap.hana.ondemand.com",
					"verificationkey": "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx/jN5v1mp/TVn9nTQoYVIUfCsUDHa3Upr5tDZC7mzlTrN2PnwruzyS7w1Jd+StqwW4/vn87ua2YlZzU8Ob0jR4lbOPCKaHIi0kyNtJXQvQ7LZPG8epQLbx0IIP/WLVVVtB8bL5OWuHma3pUnibbmATtbOh5LksQ2zLMngEjUF52JQyzTpjoQkahp0BNe/drlAqO253keiY63FL6belKjJGmSqdnotSXxB2ym+HQ0ShaNvTFLEvi2+ObkyjGWgFpQaoCcGq0KX0y0mPzOvdFsNT+rBFdkHiK+Jl638Sbim1z9fItFbH9hiVwY37R9rLtH1YKi3PuATMjf/DJ7mUluDQIDAQAB-----END PUBLIC KEY-----",
					"apiurl": "https://api.authentication.sap.hana.ondemand.com",
					"identityzone": "rm-dev",
					"identityzoneid": "dc9b21b8-0188-4145-8cfe-1ec0a8d474fa",
					"tenantid": "dc9b21b8-0188-4145-8cfe-1ec0a8d474fa"
				},
				"syslog_drain_url": null,
				"volume_mounts": []
			}
		],
		"application-logs": [
			{
				"label": "application-logs",
				"provider": null,
				"plan": "lite",
				"name": "assignment-logs",
				"tags": [],
				"instance_name": "assignment-logs",
				"binding_name": null,
				"credentials": {
					"metrics_collector_url": "https://metrics-collector.cf.sap.hana.ondemand.com/",
					"metrics_collector_client_id": "15f0e092-ef60-4f45-b840-010e0b2c8600",
					"metrics_collector_client_secret": "N2Q3MWVjNTEtZGRkNS00NjIwLTljMTItNThkNTFhMzFmNmY4L2Fzc2lnbm1lbnQtYXBwcm91dGVyLzAwZmU5ZDRjLWRjM2EtNGVlMy1hNjQ5LTE1OTE2YTFkYzgyYi9leGNlbHNpb3JfMS80NWQ4NzEwZC0xMjI1LTRkNzktOTE3YS1iOGQ0ODQyMDAyM2Ivcm0tZGV2LzA1YzJjNjQ3LWViNjAtNDBiNC1iOGJiLTY1MTJhMGVmZDY2Mi9hcHBsaWNhdGlvbi1sb2dzLzNlNDY2ZmM2LTgzM2UtNDMwYS1hNWExLWI5YWEyMzE5NTBjOC9saXRlLzc0Yjk5NmEwLTViMTMtNGQ3OC1iODFhLWMxMWE0YzM2NmI1Ni9hc3NpZ25tZW50LWxvZ3MvN2Q4YmI4N2Q2ZmRlZGYzOTYyM2M0MTJhZTU4ODdhZDYwOWZmNWZkNWVlM2ViMjU5NWQ4YTg3YjcyMjcwNzM0Mw"
				},
				"syslog_drain_url": "https://10.0.168.16:4433/syslogv2/N2Q3MWVjNTEtZGRkNS00NjIwLTljMTItNThkNTFhMzFmNmY4L2Fzc2lnbm1lbnQtYXBwcm91dGVyLzAwZmU5ZDRjLWRjM2EtNGVlMy1hNjQ5LTE1OTE2YTFkYzgyYi9leGNlbHNpb3JfMS80NWQ4NzEwZC0xMjI1LTRkNzktOTE3YS1iOGQ0ODQyMDAyM2Ivcm0tZGV2LzA1YzJjNjQ3LWViNjAtNDBiNC1iOGJiLTY1MTJhMGVmZDY2Mi9hcHBsaWNhdGlvbi1sb2dzLzNlNDY2ZmM2LTgzM2UtNDMwYS1hNWExLWI5YWEyMzE5NTBjOC9saXRlLzc0Yjk5NmEwLTViMTMtNGQ3OC1iODFhLWMxMWE0YzM2NmI1Ni9hc3NpZ25tZW50LWxvZ3MvN2Q4YmI4N2Q2ZmRlZGYzOTYyM2M0MTJhZTU4ODdhZDYwOWZmNWZkNWVlM2ViMjU5NWQ4YTg3YjcyMjcwNzM0Mw",
				"volume_mounts": []
			}
		],
		"html5-apps-repo": [
			{
				"label": "html5-apps-repo",
				"provider": null,
				"plan": "app-runtime",
				"name": "assignment-html5_repo_runtime",
				"tags": [
					"html5appsrepo",
					"html5-apps-repo-rt",
					"html5-apps-rt",
					"html5-apps-repo-dt",
					"html5-apps-dt"
				],
				"instance_name": "assignment-html5_repo_runtime",
				"binding_name": null,
				"credentials": {
					"vendor": "SAP",
					"uri": "https://html5-apps-repo-rt.cfapps.sap.hana.ondemand.com",
					"uaa": {
						"uaadomain": "authentication.sap.hana.ondemand.com",
						"tenantmode": "dedicated",
						"sburl": "https://internal-xsuaa.authentication.sap.hana.ondemand.com",
						"clientid": "sb-c588ba0c-4d8c-4d4b-b3fd-9a084e7e180e!b5957|html5-apps-repo-uaa!b1129",
						"verificationkey": "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx/jN5v1mp/TVn9nTQoYVIUfCsUDHa3Upr5tDZC7mzlTrN2PnwruzyS7w1Jd+StqwW4/vn87ua2YlZzU8Ob0jR4lbOPCKaHIi0kyNtJXQvQ7LZPG8epQLbx0IIP/WLVVVtB8bL5OWuHma3pUnibbmATtbOh5LksQ2zLMngEjUF52JQyzTpjoQkahp0BNe/drlAqO253keiY63FL6belKjJGmSqdnotSXxB2ym+HQ0ShaNvTFLEvi2+ObkyjGWgFpQaoCcGq0KX0y0mPzOvdFsNT+rBFdkHiK+Jl638Sbim1z9fItFbH9hiVwY37R9rLtH1YKi3PuATMjf/DJ7mUluDQIDAQAB-----END PUBLIC KEY-----",
						"apiurl": "https://api.authentication.sap.hana.ondemand.com",
						"xsappname": "c588ba0c-4d8c-4d4b-b3fd-9a084e7e180e!b5957|html5-apps-repo-uaa!b1129",
						"identityzone": "rm-dev",
						"identityzoneid": "dc9b21b8-0188-4145-8cfe-1ec0a8d474fa",
						"clientsecret": "E8/76ooafH47GKqVHeSAQm8dDGs=",
						"tenantid": "dc9b21b8-0188-4145-8cfe-1ec0a8d474fa",
						"url": "https://rm-dev.authentication.sap.hana.ondemand.com"
					},
					"grant_type": "client_credentials",
					"sap.cloud.service": "html5-apps-repo-rt"
				},
				"syslog_drain_url": null,
				"volume_mounts": []
			}
		]
	}
    set destinations=[{"forwardAuthToken": true,"name": "java","url": "http://localhost:4004"}]

@echo off
cd utils/localLaunchpad
echo Now starting the UI on Port 5000.
npm start
