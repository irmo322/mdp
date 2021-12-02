function spinnerBusy(element, busy) {
    let spin = Math.max(0, (element.data("spin") || 0) + (busy ? 1 : -1));
    element.data("spin", spin);

    if (spin) {
        element.finish().fadeIn();
    } else {
        element.finish().fadeOut();
    }
}

$(function () {
    let signInButton = $('#signin');
    let signOutButton = $('#signout');
    let user = $('#user');
    let userName = user.find('#userName');
    let userNameInput = userName.find('input');
    let userSecret = user.find('#userSecret');
    let userSecretInput = userSecret.find('input');
    let userSecretSpinner = userSecret.find('.fa-spin');
    let userAlgorithm = user.find('#algorithmVersion');
    let userAlgorithmInput = userAlgorithm.find('select');
    let userMessage = user.find('p.info');
    let userError = user.find('p.error');
    let site = $('#site');
    let siteName = site.find('#siteName');
    let siteNameInput = siteName.find('input');
    let sitePassword = site.find('#sitePassword');
    let sitePasswordSpinner = sitePassword.find('.fa-spin');
    let sitePasswordButton = sitePassword.find('button');
    let sitePasswordInput = sitePasswordButton.find('input')
    let siteMessage = site.find('p.info');
    let siteError = site.find('p.error');

    signInButton.on('click', function () {
        spinnerBusy(userSecretSpinner, true);

        spectre.authenticate(userNameInput[0].value, userSecretInput[0].value, userAlgorithmInput[0].value)
    });

    signOutButton.on('click', function () {
        spinnerBusy(userSecretSpinner, true);

        spectre.invalidate()
    });

    siteName.on('input', function () {
        spinnerBusy(sitePasswordSpinner, true);

        spectre.password(siteNameInput[0].value)
    });
    
    function updateView() {
        if (!spectre.authenticated) {
            userAlgorithmInput.val(spectre.algorithm.current);
            siteNameInput.val(null);
        }

        user.attr("data-active", !spectre.authenticated);
        site.attr("data-active", spectre.authenticated);

        userNameInput.val(spectre.userName);
        userSecretInput.val(null);
        sitePasswordInput.val(spectre.result(siteNameInput[0].value));
    }
    spectre.observers.push(updateView);
    updateView()

    sitePasswordButton.on('click', function () {
        sitePasswordInput.select()
        document.execCommand('copy');

        sitePasswordButton.attr("title", "Copied!").tooltip("_fixTitle").tooltip("show");
        setTimeout(function () {
            sitePasswordButton.tooltip("hide").attr("title", "Copy Password").tooltip("_fixTitle");
        }, 1000);
    });

    spinnerBusy(userSecretSpinner, false);
    spinnerBusy(sitePasswordSpinner, false);
});
