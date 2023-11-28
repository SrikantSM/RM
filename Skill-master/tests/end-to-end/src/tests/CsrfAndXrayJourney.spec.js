const testHelper = require('../utils/TestHelper');
const { describeTestCase, step } = require('../utils/TestExecutor');
const FLP = require('../../../uiveri5-pages/FLP');
const SkillListReport = require('../../../uiveri5-pages/SkillListReport');
const MarkdownTables = require('../utils/MarkdownTables');

describeTestCase(MarkdownTables.CHECK_CSRF_AND_XRAY, 'CsrfAndXrayJourney', () => {
  step(
    'Logon',
    '',
    '',
    () => {
      testHelper.loginWithRole('ConfigurationExpert');
    },
  );

  step(
    'Navigates to the Skill app to grab the service URL from',
    '',
    '',
    () => {
      it('navigates to the Skill app to grab the service URL from', () => {
        FLP.tiles.skill.click();
        FLP.waitForInitialAppLoad('skill::SkillsListReport--fe::table::Skills::LineItem-toolbar');
        expect(SkillListReport.skillList.isPresent()).toBeTruthy();
        /**
         * retrieve request sent by the UI
         * check if it contains a csrf token
        * send request without csrf token, with wrong csrf token and with correct csrf token
        * verify http status codes (403 or 200)
        */
      });
    },
  );

  step(
    'Initializes reuse functions',
    '',
    '',
    () => {
      it('initializes reuse functions', async () => {
        await browser.executeScript(() => {
          // eslint-disable-next-line no-undef
          window.createAjaxRequest = function createAjaxRequest(callback, csrfToken) {
            const component = sap.ui.getCore().getComponent('application-Skill-Display-component');
            const servicePath = component.getManifestObject().resolveUri(component.getManifestEntry('/sap.app/dataSources/mainService/uri'));
            const request = {
              method: 'POST',
              url: `${servicePath}$batch`,
              headers: {
                'Content-Type': 'multipart/mixed; boundary=batch_id-1575449302125-90',
              },
              data: '--batch_id-1575449302125-90\nContent-Type:application/http\n\nGET Skills HTTP/1.1\n\n\n--batch_id-1575449302125-90--',
              error(jqXHR, textStatus, errorThrown) {
                callback(jqXHR.status);
              },
              success(data, textStatus, jqXHR) {
                callback(jqXHR.status);
              },
            };
            if (csrfToken !== undefined) {
              request.headers = {
                'Content-Type': 'multipart/mixed; boundary=batch_id-1575449302125-90',
                'x-csrf-token': csrfToken,
              };
            }
            return request;
          };
        });
      });
    },
  );

  let csrfToken = ' ';
  step(
    'Fetches csrf token',
    '',
    '',
    () => {
      it('fetches csrf token', async () => {
        csrfToken = await browser.executeAsyncScript((done) => {
          // ATTENTION: This function will be executed in the browser! Make sure to be able to run in IE10
          const component = sap.ui.getCore().getComponent('application-Skill-Display-component');
          const servicePath = component.getManifestObject().resolveUri(component.getManifestEntry('/sap.app/dataSources/mainService/uri'));
          jQuery.ajax({
            method: 'HEAD',
            url: servicePath,
            headers: {
              'x-csrf-token': 'fetch',
            },
            error(jqXHR, textStatus, errorThrown) {
              const token = jqXHR.getResponseHeader('x-csrf-token');
              done(token);
            },
            success(data, textStatus, jqXHR) {
              const token = jqXHR.getResponseHeader('x-csrf-token');
              done(token);
            },
          });
        });
        expect(csrfToken).toBeTruthy();
      });
    },
  );

  step(
    'Sends request with correct csrf token',
    '',
    '',
    () => {
      it('sends request with correct csrf token', async () => {
        const statusCode = await browser.executeAsyncScript((innerCsrfToken, done) => {
          // eslint-disable-next-line no-undef
          jQuery.ajax(window.createAjaxRequest(done, innerCsrfToken));
        }, csrfToken);
        expect(statusCode).toBe(200);
      });
    },
  );

  step(
    'Sends request with wrong csrf token',
    '',
    '',
    () => {
      it('sends request with wrong csrf token', async () => {
        const statusCode = await browser.executeAsyncScript((done) => {
          const wrongCsrfToken = '8fc068197b6f3641-4pTZFMLZXCd1wndc4I7D2kb3r58';
          // eslint-disable-next-line no-undef
          jQuery.ajax(window.createAjaxRequest(done, wrongCsrfToken));
        });
        expect(statusCode).toBe(403);
      });
    },
  );

  step(
    'Sends request without csrf token',
    '',
    '',
    () => {
      it('sends request without csrf token', async () => {
        const statusCode = await browser.executeAsyncScript((done) => {
          // eslint-disable-next-line no-undef
          jQuery.ajax(window.createAjaxRequest(done));
        });
        expect(statusCode).toBe(403);
      });
    },
  );

  step(
    'Checks the visibility of the WebAssistant (XRay)',
    '',
    '',
    () => {
      it('checks the visibility of the WebAssistant (XRay)', () => {
        expect(FLP.header.xrayButton.isPresent()).toBeTruthy();
      });
    },
  );

  step(
    'Logout',
    '',
    '',
    () => {
      testHelper.logout();
    },
  );
});
