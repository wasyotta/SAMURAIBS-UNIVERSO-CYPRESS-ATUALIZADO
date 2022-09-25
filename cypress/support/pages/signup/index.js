import { el } from './elements'

import  toast  from '../../components/toast'

class SignupPage {

    constructor() {
        this.toast = toast
    }

    go() {
        cy.visit('/signup')
    }

    form(user) {
        cy.get(el.name).type(user.name)
        cy.get(el.email).type(user.email)
        cy.get(el.password).type(user.password)
    }

    submit() {
        cy.get(el.signupButton).click()
    }

    alertHaveText(alert){
        cy.contains('.alert-error', alert)
        .should('be.visible')
    }
}

export default new SignupPage()