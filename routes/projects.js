const express = require('express')
const Article = require('../models/article')
const User = require('../models/user')
const router = express.Router()

router.post('/add', async (req, res, next) => {
    req.article = new Article()
    next()
  }, saveArticleAndRedirect('new'))

router.get('/find/all', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.status(200).json(articles);
})

router.get('/find/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.status(400).json("Project is not available with this url. Please check again!");
  res.status(200).json(article);
})

router.get('/fetch/:username', async (req, res) => {
    console.log("fetching all projects..")
    const user = await User.findOne({ username: req.params.username })
    const articles = await Article.find({ email : user.email })
    if (articles == null) res.status(400).json("Project is not available with this url. Please check again!");
    res.status(200).json(articles);
  })

router.post('/follow/:slug', async (req, res) => {
    const new_article = await Article.findOne({ slug: req.params.slug })
    if (new_article == null) res.status(400).json("Project is not available with this url. Please check again!");
    new_article.followed.push(req.body.email)
    await new_article.save()
    .then( docs => {
        // console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
        // console.log(err); 
        res.status(500).json({error: err});
    });
  })

router.get('/followers/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.status(400).json("Project is not available with this url. Please check again!");
    res.status(200).json(article.followed);
})

router.patch('/edit/:id', async (req, res, next) => {
  console.log("Editing a project ..")
  try {
    req.article = await Article.findOne({id: req.params.id})
    }
    catch(err) {
        res.status(400).json({ error: 'No project available to edit with that id' });
    }
    next()
}, editArticleAndRedirect('edit'))

router.delete('/delete/:id', async (req, res) => {
  console.log("Deleting a project ..")
  await Article.remove({id: req.params.id})
        .exec()
        .then(result => {
            res.status(204).json({ message: 'successfully deleted' });
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {  
    let new_article = req.article
    try {
        new_article.title = req.body.title
        new_article.description = req.body.description
        new_article.markdown = req.body.markdown
        new_article.email = req.body.email
        console.log(new_article)
    }
    catch(err) {
        res.status(400).json({ error: 'All fields are required to Edit' });
    }
                
    await new_article.save()
    .then( docs => {
        // console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
        // console.log(err); 
        res.status(500).json({error: err});
    });
  }
}

function editArticleAndRedirect(path) {
    return async (req, res) => {  
    let new_article = req.article
    try {
        new_article.title = req.body.title
        new_article.description = req.body.description
        new_article.markdown = req.body.markdown
        console.log(new_article)
    }
    catch(err) {
        res.status(400).json({ error: 'All fields are required to Edit' });
    }
                
    await new_article.save()
    .then( docs => {
        // console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
        // console.log(err); 
        res.status(500).json({error: err});
    });
  }
}

module.exports = router