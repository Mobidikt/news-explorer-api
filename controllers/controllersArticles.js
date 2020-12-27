const BadRequestError = require('../middlewares/errors/BadRequestError');
const ForbiddenError = require('../middlewares/errors/ForbiddenError');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const Article = require('../models/article');
const { CLIENT_ERROR, SUCCESS } = require('../libs/messages');

const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user._id });
    return res.status(200).send(articles);
  } catch (err) {
    return next(err);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const {
      keyword, title, text, date, source, link, image,
    } = req.body;
    const article = await Article.create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: req.user._id,
    });
    return res.status(200).send({
      keyword: article.keyword,
      title: article.title,
      text: article.text,
      date: article.date,
      source: article.source,
      link: article.link,
      image: article.image,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        }),
      );
    }
    return next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId).select(
      '+owner',
    );
    if (!article) {
      return next(new NotFoundError(CLIENT_ERROR.ARTICLE));
    }
    if (article.owner.toString() !== req.user._id) {
      return next(new ForbiddenError(CLIENT_ERROR.FORBIDDEN));
    }
    await Article.findByIdAndDelete(req.params.articleId).orFail();
    return res.status(200).send({ message: SUCCESS.DELETE_ARTICLE });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(CLIENT_ERROR.DATA));
    }
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError(CLIENT_ERROR.ARTICLE));
    }
    return next(err);
  }
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
