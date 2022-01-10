function spinnerBusy(element, busy) {
    element.data("spin", busy);

    if (busy) {
        element.finish().fadeIn();
    } else {
        element.finish().fadeOut();
    }
}

$(() => {
    let signOutButton = $('#signout');
    let user = $('#user');
    let userForm = user.find('form');
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
    let siteForm = site.find('form');
    let siteName = site.find('#siteName');
    let siteNameInput = siteName.find('input');
    let sitePassword = site.find('#sitePassword');
    let sitePasswordSpinner = sitePassword.find('.fa-spin');
    let sitePasswordButton = sitePassword.find('button');
    let sitePasswordInput = sitePasswordButton.find('input')
    let siteMessage = site.find('p.info');
    let siteError = site.find('p.error');

    userForm.on('submit', (e) => {
        e.preventDefault()
        spectre.authenticate(userNameInput[0].value, userSecretInput[0].value, userAlgorithmInput[0].value)
    });
    siteForm.on('submit', (e) => {
        e.preventDefault()
        sitePasswordInput.select()
        if (navigator.clipboard.writeText(sitePasswordInput[0].value) || document.execCommand('copy')) {
            sitePasswordButton.attr("title", "Copied!").tooltip("_fixTitle").tooltip("show");
            setTimeout(() => {
                sitePasswordButton.tooltip("hide").attr("title", "Copy Password").tooltip("_fixTitle");
            }, 1000);
        }
    });

    signOutButton.on('click', () => {
        spectre.invalidate()
    });

    siteName.on('input', () => {
        spectre.password(siteNameInput[0].value)
    });
    
    function updateView() {
        spinnerBusy(userSecretSpinner, spectre.operations.user.pending);
        spinnerBusy(sitePasswordSpinner, spectre.operations.site.pending);

        userNameInput.val(spectre.operations.user.userName);
        userSecretInput.val(null);
        sitePasswordInput.val(spectre.result(siteNameInput[0].value));

        if (spectre.operations.user.authenticated) {
            user.attr("data-active", false);
            site.attr("data-active", true);
            siteNameInput.focus()
        } else {
            user.attr("data-active", true);
            site.attr("data-active", false);
            userAlgorithmInput.val(spectre.algorithm.current);
            siteNameInput.val(null);
            userNameInput.focus()
        }
    }
    spectre.observers.push(updateView);
    updateView()
});
