const express = require('express')
const app = express()
const port = 3000

app.get('/', async (req, res) => {
    const ancestries = [
        {
        'Name': 'test name',
        'Traits': 'test traits',
        'Description': {
            'General': 'test general discription',
            'YouMight': 'test you might',
            'OthersProbably': 'test others probably',
            'PhysicalDescription': 'test physical description',
            'Society': 'test society',
            'AlignmentReligion': 'test alignment and religion',
            'Names': 'test names',
            'SampleNames': 'test sample names'
        },
        'HP': 'test hp',
        'Size': 'test size',
        'Speed': 'test speed',
        'Boosts': 'test boosts',
        'Flaws': 'test flaws',
        'Languages': 'test languages',
        'Specials': 'test specials',
        'URL': 'test url',
        'LastUpdated': 'test last updated'
        }
    ]

  res.send('ancestries')
})

app.post('/', async (req, res) => {

})

//app.listen(port, () => {
//  console.log(`Example app listening at http://localhost:${port}`)
//})