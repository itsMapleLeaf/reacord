export {}

describe("main popover menu", () => {
  it("should toggle on button click", () => {
    cy.viewport(480, 720)
    cy.visit("/")
    cy.findByRole("button", { name: "Menu" }).click()
    cy.findByRole("menu").should("be.visible")
    cy.findByRole("button", { name: "Menu" }).click()
    cy.findByRole("menu").should("not.exist")
  })
})
