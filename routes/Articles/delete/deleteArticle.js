const express = require(`express`)
const mongoose = require(`mongoose`)
const createError = require(`http-errors`)
const jwt = require("jsonwebtoken")
const router = express.Router()

const Article = require(`../../../models/articleModel/articlesModel`)

router.delete(`/deletearticle/:articleId`, async (req, res, next) => {

    const queryId = req.params.articleId

    let token

    if (req.headers.authorization && req.headers.authorization.startsWith(`Bearer`)) {
        token = req.headers.authorization.split(` `)[1]
    }

    if (!token) {
        return next(createError(401, `Please Log In.`))
    }

    try {

        jwt.verify(token, process.env.JWT_SECRET_KEY)

        const currentQuery = await Article.findOneAndDelete({_id: queryId})

        if (!currentQuery) {
            return next(createError(404, `Not found`))
        }

        res.json({
            status: res.statusCode,
            message: `Succesfully deleted.`
        })
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

module.exports = router