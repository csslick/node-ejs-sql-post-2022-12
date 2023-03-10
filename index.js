const express = require('express');
const app = express();
const ejs = require('ejs');
const { sequelize, Posts } = require('./database')

// post 전송시 필요한 모듈(미들웨어)
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// DB 연결
sequelize.sync().then(function(){
  console.log('데이터 연결 완료')
})



// ejs를 view 엔진으로 설정
app.set('view engine', 'ejs');

// 정적파일 경로 지정
app.use(express.static("public"));

// home
app.get('/', async function(req, res){
  // db에서 Posts 테이블 불러오기
  // SELECT * FROM Posts
  const posts = await Posts.findAll();
  // SELECT * FROM Posts WHERE post="새글 1"
  /*
    const posts = await Posts.findAll({
      where: { post: '새글 2'}
    });
  */
  // 테스트 코드
  // console.log(JSON.stringify(posts, null, 2))
  res.render('pages/index.ejs', { posts });
})

// about
app.get('/about', function(req, res) {
  res.render('pages/about.ejs')
})

// 글쓰기 요청
app.post('/create', async function(req, res) {
  // res.send('응답받음 ' + req.body.post)
  let post = req.body.post;
  // 테이블명.create({컬럼이름: 값})
  const newPost = await Posts.create({ post: post })
  // console.log("auto-generated ID:", newPost.id);
  res.redirect('/'); // 새로 고침
})


app.post('/delete/:id', async function(req, res){
  console.log(req.params.id)
  await Posts.destroy({
    where: {
      id: req.params.id // 삭제할 글번호
    }
  });
  // res.send(req.params)
  res.redirect('/'); // 새로 고침
})


const port = 3001;
app.listen(port, () => {
  console.log(`server running at ${port}`)
})