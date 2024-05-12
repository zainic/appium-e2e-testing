import { $, driver, expect} from '@wdio/globals'

describe('End to end add to cart function', () => {
    it('EF001 - Succesfully open the app', async () => {
        await driver.pause(1000)
        const logo = await driver.$('~App logo and name')
        await expect(logo).toExist()
    })
    it('EF002 - Open the login page', async () => {
        const moreBtn = await driver.$('~View menu')
        await moreBtn.waitForExist()
        await moreBtn.click()

        await driver.pause(500)

        await driver.action("pointer")
            .move({x:250, y:600})
            .down()
            .pause(100)
            .move({x:250, y:300, duration:500})
            .up()
            .perform()

        await driver.$('//android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/itemTV" and @text="Log In"]').click()
        await driver.pause(500)
        const loginPageTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/loginTV')
        await expect(loginPageTitle).toHaveText('Login')
    })
    it('EF003 - Login with valid username and password', async () => {
        const username = await driver.$('id=com.saucelabs.mydemoapp.android:id/nameET')
        const password = await driver.$('id=com.saucelabs.mydemoapp.android:id/passwordET')
        await username.setValue('bod@example.com')
        await password.setValue('10203040')

        await driver.$('~Tap to login with given credentials').click()
        await driver.pause(500)

        const productPageTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/productTV')
        await expect(productPageTitle).toHaveText('Products')
    })
    it('EF004 - Select a product and go into proper page ', async () => {
        const product = await driver.$('~Sauce Labs Backpack')
        const productName = await driver.$('//android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/titleTV" and @text="Sauce Labs Backpack"]')
        const productPrice = await driver.$('//android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/priceTV" and @text="$ 29.99"]')

        await product.click()
        await driver.pause(500)

        const productNamePage = await driver.$('id=com.saucelabs.mydemoapp.android:id/productTV')
        const productPricePage = await driver.$('id=com.saucelabs.mydemoapp.android:id/priceTV')

        expect(productNamePage).toHaveText(productName.getText())
        expect(productPricePage).toHaveText(productPrice.getText())
    })
    it('EF005 - Every rating product should work properly', async () => {
        for (let i=1; i<=5; i++){
            let stars = await driver.$(`id=com.saucelabs.mydemoapp.android:id/start${i}IV`)
            await stars.click()
            await driver.pause(500)
            let popUpRating = await driver.$('id=com.saucelabs.mydemoapp.android:id/sortTV')
            await expect(popUpRating).toHaveText(
                'Thank you for submitting your review!'
            )
            await driver.$('~Closes review dialog').click()
        }
    })
    it('EF006 - Every selecting color should work', async () => {
        await driver.action("pointer")
            .move({x:360, y:1000})
            .down()
            .pause(100)
            .move({x:360, y:500, duration:500})
            .up()
            .perform()
        
        const colorSelected = await driver.$('~Indicates when color is selected')

        const greenColor = await driver.$('~Green color')
        await greenColor.click()
        const greenColorBoundary = await driver.$('//androidx.recyclerview.widget.RecyclerView[@content-desc="Displays available colors of selected product"]/android.view.ViewGroup[4]')
        await expect(greenColorBoundary).toHaveChildren(colorSelected)

        const grayColor = await driver.$('~Gray color')
        await grayColor.click()
        const grayColorBoundary = await driver.$('//androidx.recyclerview.widget.RecyclerView[@content-desc="Displays available colors of selected product"]/android.view.ViewGroup[3]')
        await expect(grayColorBoundary).toHaveChildren(colorSelected)

        const blackColor = await driver.$('~Black color')
        await blackColor.click()
        const blackColorBoundary = await driver.$('//androidx.recyclerview.widget.RecyclerView[@content-desc="Displays available colors of selected product"]/android.view.ViewGroup[1]')
        await expect(blackColorBoundary).toHaveChildren(colorSelected)

        const blueColor = await driver.$('~Blue color')
        await blueColor.click()
        const blueColorBoundary = await driver.$('//androidx.recyclerview.widget.RecyclerView[@content-desc="Displays available colors of selected product"]/android.view.ViewGroup[2]')
        await expect(blueColorBoundary).toHaveChildren(colorSelected)
    })
    it('EF007 - Adding and removing item should work properly', async () => {
        const itemCount = await driver.$('id=com.saucelabs.mydemoapp.android:id/noTV')
        const incItem = await driver.$('~Increase item quantity')
        const decItem = await driver.$('~Decrease item quantity')
        const addToCartBtn = await driver.$('~Tap to add product to cart')

        await expect(itemCount).toHaveText('1')
        await incItem.click()
        await expect(itemCount).toHaveText('2')
        await incItem.click()
        await expect(itemCount).toHaveText('3')
        await decItem.click()
        await expect(itemCount).toHaveText('2')
        await decItem.click()
        await expect(itemCount).toHaveText('1')
        await decItem.click()
        await expect(itemCount).toHaveText('0')
        await decItem.click()
        await expect(itemCount).toHaveText('0')
        await incItem.click()
    })
    it('EF008 - Add to cart button should enable and disable properly', async () => {
        const incItem = await driver.$('~Increase item quantity')
        const decItem = await driver.$('~Decrease item quantity')
        const addToCartBtn = await driver.$('~Tap to add product to cart')

        await decItem.click()
        await expect(addToCartBtn).toBeDisabled()
        await incItem.click()
        await expect(addToCartBtn).toBeEnabled()
    })
    it('EF009 - Add to cart button should work properly with pricing', async () => {
        const incItem = await driver.$('~Increase item quantity')
        // const colorItem = await driver.$('~Blue color')
        const priceItem = await driver.$('id=com.saucelabs.mydemoapp.android:id/priceTV').getText()
        const addToCartBtn = await driver.$('~Tap to add product to cart')
        await incItem.click()
        await incItem.click()
        await addToCartBtn.click()

        const totalPrice = Number(/\$ (.*)/.exec(priceItem)[1]) * 3

        const cartBtn = await driver.$('~View cart')
        const itemInCart = await driver.$('id=com.saucelabs.mydemoapp.android:id/cartTV')
        await expect(itemInCart).toHaveText('3')
        await cartBtn.click()
        await driver.pause(500)

        const productInCartCount = await driver.$('id=com.saucelabs.mydemoapp.android:id/noTV')
        const productInCartPrice = await driver.$('id=com.saucelabs.mydemoapp.android:id/priceTV')
        const productInCartTotalPrice = await driver.$('id=com.saucelabs.mydemoapp.android:id/totalPriceTV')
        const productInCartTotalItems = await driver.$('id=com.saucelabs.mydemoapp.android:id/itemsTV')
        // const productInCartColor = await driver.$('~Displays color of selected product')
        await expect(productInCartCount).toHaveText('3')
        await expect(productInCartPrice).toHaveText(priceItem)
        // await expect(productInCartColor).toEqual(colorItem)
        await expect(productInCartTotalPrice).toHaveText(`$ ${totalPrice}`)
        await expect(productInCartTotalItems).toHaveText(expect.stringContaining('3'))
    })
    it('EF010 - Proceed button should work and goes to login page again', async () => {
        const proceedBtn = await driver.$('~Confirms products for checkout')
        proceedBtn.click()
        await driver.pause(500)

        const loginPageTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/loginTV')
        await expect(loginPageTitle).toHaveText('Login')
    })
    it('EF011 - Login and proceed to checkout page', async () => {
        const username = await driver.$('id=com.saucelabs.mydemoapp.android:id/nameET')
        const password = await driver.$('id=com.saucelabs.mydemoapp.android:id/passwordET')
        await username.setValue('bod@example.com')
        await password.setValue('10203040')

        await driver.$('~Tap to login with given credentials').click()
        await driver.pause(500)

        const checkoutPageTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/checkoutTitleTV')
        await expect(checkoutPageTitle).toHaveText('Checkout')
    })
    it('EF012 - Fill the detail and goes into payment page', async () => {
        const fullName = await driver.$('id=com.saucelabs.mydemoapp.android:id/fullNameET')
        const address1 = await driver.$('id=com.saucelabs.mydemoapp.android:id/address1ET')
        const address2 = await driver.$('id=com.saucelabs.mydemoapp.android:id/address2ET')
        const city = await driver.$('id=com.saucelabs.mydemoapp.android:id/cityET')
        const state = await driver.$('id=com.saucelabs.mydemoapp.android:id/stateET')
        const zipCode = await driver.$('id=com.saucelabs.mydemoapp.android:id/zipET')
        const country = await driver.$('id=com.saucelabs.mydemoapp.android:id/countryET')

        await fullName.setValue('Dzaky Tamir')
        await address1.setValue('Pangadegan')
        await address2.setValue('Pasar Kemis')
        await city.setValue('Tangerang')
        await state.setValue('Banten')
        await zipCode.setValue('15561')
        await country.setValue('Indonesia')

        await driver.action("pointer")
            .move({x:360, y:700})
            .down()
            .pause(100)
            .move({x:360, y:500, duration:500})
            .up()
            .perform()
        
        await driver.$('~Saves user info for checkout').click()
        await driver.pause(500)

        const paymentPageTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/enterPaymentMethodTV')
        await expect(paymentPageTitle).toHaveText(expect.stringContaining('payment'))
    })
    it('EF013 - Fill the payment info and goes into review checkout page', async () => {
        const fullName = await driver.$('id=com.saucelabs.mydemoapp.android:id/nameET')
        const cardNumber = await driver.$('id=com.saucelabs.mydemoapp.android:id/cardNumberET')
        const expDate = await driver.$('id=com.saucelabs.mydemoapp.android:id/expirationDateET')
        const stateCode = await driver.$('id=com.saucelabs.mydemoapp.android:id/securityCodeET') 

        await fullName.setValue('Dzaky')
        await cardNumber.setValue('1234567890123456')
        await expDate.setValue('05/25')
        await stateCode.setValue('123')

        await driver.$('~Saves payment info and launches screen to review checkout data').click()
        await driver.pause(500)

        const reviewPageTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/enterShippingAddressTV')
        await expect(reviewPageTitle).toHaveText('Review your order')
    })
    it('EF014 - Check data to be same as user was filled', async () => {
        await driver.action("pointer")
            .move({x:360, y:1000})
            .down()
            .pause(100)
            .move({x:360, y:500, duration:500})
            .up()
            .perform()

        const fullName = await driver.$('id=com.saucelabs.mydemoapp.android:id/fullNameTV')
        const address = await driver.$('id=com.saucelabs.mydemoapp.android:id/addressTV')
        const city = await driver.$('id=com.saucelabs.mydemoapp.android:id/cityTV')
        const country = await driver.$('id=com.saucelabs.mydemoapp.android:id/countryTV')

        const fullNameCard = await driver.$('id=com.saucelabs.mydemoapp.android:id/cardHolderTV')
        const cardNumber = await driver.$('id=com.saucelabs.mydemoapp.android:id/cardNumberTV')
        const expDate = await driver.$('id=com.saucelabs.mydemoapp.android:id/expirationDateTV')

        await expect(fullName).toHaveText('Dzaky Tamir')
        await expect(address).toHaveText('Pangadegan')
        await expect(city).toHaveText('Tangerang, Banten')
        await expect(country).toHaveText('Indonesia, 15561')
        await expect(fullNameCard).toHaveText('Dzaky')
        await expect(cardNumber).toHaveText('1234567890123456')
        await expect(expDate).toHaveText(expect.stringContaining('05/25'))
    })
    it('EF015 - User place the order complete the checkout and back to main page', async () => {
        await driver.$('~Completes the process of checkout').click()
        await driver.pause(500)

        const checkoutCompletePageTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/completeTV')
        await expect(checkoutCompletePageTitle).toHaveText('Checkout Complete')

        await driver.$('~Tap to open catalog').click()
        await driver.pause(500)

        const productPageTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/productTV')
        await expect(productPageTitle).toHaveText('Products')
    })
})

