module.exports = {
    signUp: async(req, res, next) => {
        console.log('Contents of  req.value.body', req.value.body);
        console.log('UserController.singUp called!');
    },

    signIn: async(req, res, next) => {
        console.log('UserController.singIn called!');
    },

    secret: async(req, res, next) => {
        console.log('UserController.secret called!');
    },
}