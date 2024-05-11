import { $, driver, expect} from '@wdio/globals'

describe('End to end add to cart function', () => {
    it('EF001 - Succesfully open the app', async () => {
        const b = await driver.$('~View menu')
        await b.waitForExist()
        await b.click()

        await driver.pause(1000)

        await driver.action("pointer")
            .move({x:250, y:600})
            .down()
            .pause(100)
            .move({x:250, y:300, duration:500})
            .up()
            .perform()

        await driver.pause(1000)
    })
})

