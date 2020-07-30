const airsNum = '03900001'
const facilityName = 'durango'
const permitNum = '2631-039-0001-V-01-0'
const permitLink = 'permit.aspx?id=PDF-VF-9427'

describe('Permit Search', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('searches by AIRS', () => {
    cy.get('[id$=txtAirsNo_Input]').type(airsNum)

    cy.get('.racSlide')
      .eq(0)
      .should('be.visible')
      .find('.racList')
      .children()
      .should('have.length', 1)

    cy.get('.racList li')
      .eq(0)
      .click()

    cy.get('[id$=gvwPermits] tbody tr').should('have.length', 2)
  })

  it('searches by facility name', () => {
    cy.get('[id$=txtFacility_Input]').type(facilityName)

    cy.get('.racSlide')
      .eq(1)
      .should('be.visible')
      .find('.racList')
      .children()
      .should('have.length', 1)

    cy.get('.racList li')
      .eq(0)
      .click()

    cy.get('[id$=gvwPermits] tbody tr').should('have.length', 2)
  })

  it('searches by permit number', () => {
    cy.server()
    cy.route('POST', '/').as('xhr')

    cy.get('[id$=txtSIC]').type(permitNum)
    cy.get('[id$=btnSearch]').click()
    cy.wait('@xhr')

    cy.get('[id$=gvwPermits] tbody tr')
      .should('have.length', 1)
      .contains('a', permitNum)
      .should('have.attr', 'href', permitLink)
  })

  it('loads permit', () => {
    cy.request(permitLink).then(response => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.eq('application/pdf')
    })
  })
})
