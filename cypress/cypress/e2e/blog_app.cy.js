describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'June',
      username: 'June',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('/')
  })
  
  it('Login form is shown', function() {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('June')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('June logged-in').should('be.visible')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('June')
      cy.get('#password').type('xxxxx')
      cy.get('#login-button').click()
      cy.contains('June logged-in').should('not.exist')
      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'June', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.createBlog({
        title: 't-test',
        author: 'a-test',
        url: 'http://example.com'
      })
      cy.contains('t-test a-test').should('be.visible')
    })
  })

  describe('when a blog exists', function() {
    beforeEach(function() {
      cy.login({ username: 'June', password: 'salainen' })
      cy.createBlog({
        title: 't-test',
        author: 'a-test',
        url: 'http://example.com'
      })
      cy.visit('/')
    })

    it('Users can like a blog', function() {
      cy.contains('t-test a-test').parent().contains('View').click()
      cy.contains('t-test a-test').parent().find('[aria-label="like-button"]').click()

      cy.contains('t-test a-test').parent().should('contain.text', 'likes 1')
    })
  })

  describe('blog deletion', function() {
    beforeEach(function() {
      cy.login({ username: 'June', password: 'salainen' })
      cy.createBlog({
        title: 't-test',
        author: 'a-test',
        url: 'http://example.com'
      })
      cy.visit('/')
    })

    it('A user who created a blog can delete it', function() {
      cy.contains('t-test a-test').parent().contains('View').click()
      cy.get('[aria-label="remove-button"]').click()
      cy.contains('t-test a-test').should('not.exist')
    })

    it('other users cannot delete the blog', function() {
      cy.get('[aria-label="logout-button"]').click()
      const anotherUser = {
        name: 'July',
        username: 'July',
        password: 'salainen'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)
      cy.login({ username: 'July', password: 'salainen' })
      cy.visit('/')
      cy.contains('t-test a-test').parent().contains('View').click()
      cy.get('[aria-label="remove-button"]').should('not.exist')
    })
  })

  describe('Blogs are ordered by likes', function() {
    beforeEach(function() {
      cy.login({ username: 'June', password: 'salainen' })
      cy.createBlog({
        title: 't-test',
        author: 'a-test',
        url: 'http://example.com'
      })
      cy.createBlog({
        title: 't-test2',
        author: 'a-test2',
        url: 'http://example2.com'
      })
      cy.visit('/')
    })

    it('Blogs are ordered by likes', function() {
      cy.contains('t-test a-test').parent().contains('View').click()
      cy.contains('t-test a-test').parent().find('[aria-label="like-button"]').click()
      cy.contains('t-test a-test').parent().should('contain.text', 'likes 1')

      cy.contains('t-test2 a-test2').parent().contains('View').click()
      cy.contains('t-test2 a-test2').parent().find('[aria-label="like-button"]').click()
      cy.contains('t-test2 a-test2').parent().should('contain.text', 'likes 1')
      cy.contains('t-test2 a-test2').parent().find('[aria-label="like-button"]').click()
      cy.contains('t-test2 a-test2').parent().should('contain.text', 'likes 2')
      cy.get('.blog').eq(0).should('contain.text', 't-test2 a-test2')
      cy.get('.blog').eq(1).should('contain.text', 't-test a-test')
    })
  })
})
