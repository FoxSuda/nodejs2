const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, UserToken} = require('../models/models');

const generateJwt = (id, login) => {
    return jwt.sign(
        {id, login},
        process.env.SECRET_KEY,
        {expiresIn: '10m'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {login, password} = req.body;
        if (!login || !password) {
            return next(ApiError.badRequest('Invalid login or password'));
        }

        let loginType = '';

        if (login.includes('@')) {
            loginType = 'Email';
        } else {
            loginType = 'Phone number';
        }

        const candidate = await User.findOne({where: {login}});
        if (candidate) {
            return next(ApiError.badRequest('This login already exist'));
        }
        
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({login, loginType, password: hashPassword});
        const token = generateJwt(user.id, user.login);
        return res.json({token});
    }

    async login(req, res, next) {
        const {login, password} = req.body;
        const user = await User.findOne({where: {login}});
        if (!user) {
            return next(ApiError.internal('Invalid login'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Invalid password'));
        }
        const token = generateJwt(user.id, user.login);
        await UserToken.create({ token, userId: user.id });
        return res.json({token});
    }

    async logout(req, res, next) {
        try {
            const { all } = req.query;
    
            if (all) {
                await UserToken.destroy({ where: {} });
                return res.json({ message: 'All tokens removed' });
            } else {
                await UserToken.destroy({ where: { userId: req.user.id } });
                return res.json({ message: 'Current token removed' });
            }
        } catch (error) {
            return next(ApiError.internal('Internal server error'));
        }
    }

    async info(req, res, next) {
        try {
            return res.json({ id: req.user.id, login: req.user.login });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async latency(req, res, next) {
        const startTime = Date.now();

        try {
            await fetch('https://www.google.com');
            const latency = Date.now() - startTime;

            return res.json({ latency });
        } catch (error) {
            return next(ApiError.internal('Error checking latency'));
        }
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.login);
        return res.json({token});
    }
}

module.exports = new UserController();