module.exports = function(server){
  server.get('/',function(req,res){
    res.redirect('/posts')
  })
  server.use('/signup',require('./signup'))
  server.use('/signin',require('./signin'))
  server.use('/signout',require('./signout'))
  server.use('/posts',require('./posts'))
  // server.use('/comment',require('./comment'))
}