const expect=require('expect');
const request=require('supertest');
const {ObjectID} =require('mongodb');

const {app}= require('./../server');
const {Todo}= require('./../models/todo');
const {User}= require('./../models/user');

const {todos,seedTodos, users,seedUsers}=require('./seed/seed');



//clear db before running tests
beforeEach(seedUsers);
beforeEach(seedTodos);

describe("POST/todos",()=>{
    it('should create a new todo', (done)=>{
        const text="Test Todo text";
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));
            });
    });
    it('should not create todo with invalid body data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });

    });
});

describe("GET /todos",()=>{
    it('should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todo/:id",()=>{
    it('should return todo doc',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    });
    it('should return a 404 if todo not found',(done)=>{
         request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });
    it('should return 404 for non-object ids',(done)=>{
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
        const hexId=todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toNotExist();
                    done();
                }).catch((e)=>done(e));
            });
    });
    it('should return 404 if todo not found',(done)=>{
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });
    it('should return 404 id ObjectID is invalid',(done)=>{
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done)
    });
});

describe("PATCH  /todos/:id", ()=>{
    it('should update the todo', (done)=>{
        const hexId=todos[0]._id.toHexString();
        const text="Update from test";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed: true})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });
    it('should clear completedAt when todo is not completed',(done)=>{
        const hexId=todos[1]._id.toHexString();
        const text="Update from test !!";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed: false})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('GET /users/me',()=>{
    it('should return if authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return a 401 if not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done)
    });
});
describe('POST /users',()=>{
    const email="abel4@gmail.com";
    const password="123457";

    it('should create a user',(done)=>{
        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err){
                    return done(err);
                }
                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            });
    });
    it('it should validation errors if request is invalid',(done)=>{
        const badEmail="abel";
        const badPassword="123";
        request(app)
            .post('/users')
            .send({badEmail,badPassword})
            .expect(400)
            .end(done)
    });
    it('should not create a user if email is in use',(done)=>{
        request(app)
            .post('/users')
            .send({email: users[0].email, password:'123'})
            .expect(400)
            .end(done)
    });
});