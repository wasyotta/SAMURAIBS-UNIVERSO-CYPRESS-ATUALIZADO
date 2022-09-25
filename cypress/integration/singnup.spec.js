// o Intercept, serve para interceptar uma chamada de api 
//const email = faker.internet.email------> linha de código usada para gerar massa de teste dinâmica
//import { faker } from '@faker-js/faker';

// cy.intercept('POST', '/users', {
//     statusCode: 200
// }).as('postuser')

//cy.wait('@postuser')

import signupPage from '../support/pages/signup'

describe('Cadastro', function () {


    context('Quando o usuário é novato', function () {

        const user = {
            name: 'Wilson Alves Silva',
            email: 'teste@qa.com.br',
            password: '123456'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('Deve cadastrar com sucesso', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

        })

    })
    context('Quando o email já existe', function () {

        const user = {
            name: 'Wilson Alves Silva',
            email: 'teste@qa.com.br',
            password: '123456',
            is_provider: true

        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user

            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('Não deve cadastrar o usuário', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')

        })
    })
    context('Quando o email é incorreto', function () {

        const user = {
            name: 'Wilson Alves Silva',
            email: 'teste.com.br',
            password: '123456'
        }

        it('Deve exibir mensagem de alerta', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')

        })
    })
    context('Quando a senha tem menos de 6 caracteres', function () {

        const passwords = ['1', '2a', '3ab', '4abc', '5abcd']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('Não deve cadastrar a senha:' + p, function () {

                const user = { name: 'Wilson Alves Silva', email: 'teste@testers.com.br', password: p }
                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })
    context('Quando não preenche nenhum campo', function () {

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function () {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function (alert) {

            it('Dever exibir' + alert.toLocaleLowerCase(), function () {
                signupPage.alertHaveText(alert)

            })
        })
    })
})





