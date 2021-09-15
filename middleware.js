//  redirect people to login
module.exports.redirectToLogin = (req, res, next) => {
    if (!req.session.userId) {
    res.clearCookie('mrcoffee_project4');
    res.redirect('/login');
    } else {
        next();
    }
}

//  redirect people to login
module.exports.redirectToHome = (req, res, next) => {
    if (req.session.userId) {
    res.redirect('/');
    } else {
        next();
    }
}