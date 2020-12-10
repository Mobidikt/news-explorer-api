const BadRequestError = require('../middlewares/errors/BadRequestError');
const ForbiddenError = require('../middlewares/errors/ForbiddenError');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const Article = require('../models/article');

const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user._id });
    return res.status(200).send(articles);
  } catch (err) {
    return next();
  }
};

const createArticle = async (req, res, next) => {
  try {
    const { keyword, title, text, date, source, link, image } = req.body;
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
    return res.status(200).send(article);
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
    return next();
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (article.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Недостаточно прав');
    } else {
      await Article.findByIdAndDelete(req.params.cardId).orFail();
      return res.status(200).send({ message: 'Статья удалена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Нет статьи с таким id'));
    }
    return next();
  }
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
