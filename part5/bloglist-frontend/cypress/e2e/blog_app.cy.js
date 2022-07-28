describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3002/api/testing/reset')
    const user = {
      name: 'John Doe',
      username: 'john-doe3',
      passwordHash: 'password123'
    }
    cy.request('POST', 'http://localhost:3002/api/persons/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })
  describe('Login', function () {
    it('Successful login', function () {
      cy.get('#usernameLogin').type('john-doe3')
      cy.get('#passwordLogin').type('password123')
      cy.get('#loginbutton').click()
      cy.contains('John Doe logged in', { timeout: 10000 })
    })
    it('Failed login with wrong credentials', function () {
      cy.get('#usernameLogin').type('Jo')
      cy.get('#passwordLogin').type('password123')
      cy.get('#loginbutton').click()

      cy.get('.failure').should('contain', 'Wrong username or password', { timeout: 10000 })
      cy.get('html').should('not.contain', 'John Doe logged in')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.contains('login').click()
      cy.get('#usernameLogin').type('john-doe3')
      cy.get('#passwordLogin').type('password123')
      cy.get('#loginbutton').click()
      cy.contains('John Doe logged in', { timeout: 10000 })
    })
    it('Successfully created new blog', function () {
      cy.contains('Create blog').click()
      cy.get('.titleInput').type('Test title')
      cy.get('.authorInput').type('Test author')
      cy.get('.urlInput').type('Test url')
      cy.get('.submitBlogInput').click()
      cy.contains('Test title', { timeout: 10000 })
    })
    describe('When created a blog', function () {
      beforeEach(function () {
        cy.contains('Create blog').click()
        cy.get('.titleInput').type('Test title')
        cy.get('.authorInput').type('Test author')
        cy.get('.urlInput').type('Test url')
        cy.get('.submitBlogInput').click()
      })
      it('Successfully liked a blog', function () {
        cy.get('.viewDetailsBut').click()
        cy.get('.likeBut').click()
        cy.contains('likes 1', { timeout: 10000 })
      })
      it('Deleted a Blog', function () {
        cy.get('.viewDetailsBut').click()
        cy.get('#deleteBlog').click()
        cy.get('html').should('not.contain', 'Test title')
      })
    })
  })
})

describe('Three blogs created', function() {
  beforeEach(function() {
    const username = 'teppo1'
    const password = 'kissa123'
    cy.newUser({ username, password })
    cy.login({ username, password })
    cy.createBlog({ title: 'least likes', author: 'Jaska', url: 'www.fi' })
    cy.createBlog({ title: 'second most likes', author: 'Jaska', url: 'www.fi' })
    cy.createBlog({ title: 'most likes', author: 'Jaska', url: 'www.fi' })
  })

  it('check blog sorting based on likes', function() {
    // check original order
    cy.get('.blog').eq(0).as('least').should('contain', 'least likes')
    cy.get('.blog').eq(1).as('second').should('contain', 'second most likes')
    cy.get('.blog').eq(2).as('most').should('contain', 'most likes')

    // like post once
    cy.get('@second').find('#open-togglable').click()
    cy.get('@second').find('#like-button').click()

    // like post twice
    cy.get('@most').find('#open-togglable').click()
    cy.get('@most').find('#like-button').click()
    cy.wait(1000)
    cy.get('@most').find('#like-button').click()

    // check new order
    cy.get('.blog').eq(0).should('contain', 'most likes')
    cy.get('.blog').eq(1).should('contain', 'second most likes')
    cy.get('.blog').eq(2).should('contain', 'least likes')
  })
})