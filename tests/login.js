// process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../models/userModel');
const assert = chai.assert;
const bcrypt = require('bcryptjs');
const request = require('supertest');

chai.use(chaiHttp);

const testUser = {
  name: 'Ite ',
  email: 'itedev2252@gmail.com',
  passwordConfirm: 'test1234',
};

describe('Sign Up tests', () => {
  it('It should be successful when the values are all valid', () => {
    const response = chai
      .request(server)
      .post('/api/v1/users/signup')
      .send(testUser);

    console.log(response);

    // .end((err, res) => {
    //   assert.equal(res.status, 201);
    //   assert.include(res.body.message.toLowerCase(), 'success');
    // });
  });

  // it('It should return all tours', (done) => {
  //   request(app)
  //     .get('/api/v1/tours/')
  //     .expect(200)
  //     .end((err, res) => {
  //       assert.equal(5, 3);
  //       done();
  //     });
  //   done();
  // });

  //   it('Should throw error when lastName is missing', (done) => {
  //     chai
  //       .request(server)
  //       .post('/api/v1/users/signup')
  //       .send(testUser)
  //       .end((err, res) => {
  //         assert.equal(res.status, 400);
  //         assert.include(res.body.message.toLowerCase(), 'last name');
  //         done();
  //       });
  //   });

  //   it('Should return the user object when successful ', (done) => {
  //     chai
  //       .request(server)
  //       .post('/api/v1/users/signup')
  //       .send(testUser)
  //       .end((err, res) => {
  //         assert.equal(res.status, 201);
  //         done();
  //       });
  //   });

  // const testUser = {
  //     name: 'test-user',
  //     password: 'password',
  //     passwordConfirm: 'password',
  //     email: 'ite@gmail.com'
  // }

  // const {name, email, password, passwordConfirm} = testUser
  // chai.use(chatHttp)

  // describe('Login tests',()=>{
  //     before(async()=>{
  //         try {

  //             const hash = await bcrypt.hash(password,12);
  //             //create a new user
  //             await User.create({
  //                 email,
  //                 name,
  //                 password,
  //                 passwordConfirm
  //             })
  //         } catch (error) {
  //             console.log('.')
  //         }
  //     })

  //     it('Should throw error when email is missing',(done)=>{
  //         chai
  //         .request(server)
  //         .post('/api/v1/users/login')
  //         .send({password})
  //         .end((err,res)=>{
  //             assert.equal(res.status,400)
  //             assert.include(res.body.message.toLowerCase(),'email')
  //             done()
  //         })
  //     })

  // it('Should throw error when password is missing',(done)=>{
  //     chai
  //     .request(server)
  //     .post('/api/v1/users/login')
  //     .send({email})
  //     .end((err,res)=>{
  //         assert.equal(res.status,400)
  //         assert.include(res.body.message.toLowerCase(),'password')
  //         done()
  //     })
  // })

  // it('Should throw error when email doesnt exist',(done)=>{
  //     chai
  //     .request(server)
  //     .post('/api/v1/users/login')
  //     .send({email:'test34@gmail.com', password})
  //     .end((err,res)=>{
  //         assert.equal(res.status,404)
  //         assert.include(res.body.message.toLowerCase(),'not exist')
  //         done()
  //     })
  // })

  // it('Should throw error when wrong password is provided',(done)=>{
  //     chai
  //     .request(server)
  //     .post('/auth/login')
  //     .send({email, password:'wrong password'})
  //     .end((err,res)=>{
  //         assert.equal(res.status,401)
  //         assert.include(res.body.message.toLowerCase(),'invalid')
  //         done()
  //     })
  // })

  // it('It should be successful when the values are all valid',(done)=>{
  //     chai
  //     .request(server)
  //     .post('/auth/login')
  //     .send({password,email})
  //     .end((err,res)=>{
  //         console.log(email,password)
  //         assert.equal(res.status,200)
  //         assert.include(res.body.message.toLowerCase(),'success')
  //         done()
  //     })
  // })
  // })
});
