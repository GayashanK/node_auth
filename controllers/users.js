module.exports = {
    signUp: async(req, res, next) => {
        console.log('UserController.singUp called!');
    },

    signIn: async(req, res, next) => {
        console.log('UserController.singIn called!');
    },

    secret: async(req, res, next) => {
        console.log('UserController.secret called!');
    },
}