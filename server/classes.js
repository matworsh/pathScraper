class Ancestry {
    lastScraped = '';
    constructor(){
        this.Name = '';
        this.Traits = [];
        this.Description = {
            'General': '',
            'YouMight': [],
            'OthersProbably': [],
            'PhysicalDescription': '',
            'Society': '',
            'AlignmentReligion': '',
            'Names': '',
            'SampleNames': []
        };
        this.Mechanics = {
            'HP': '',
            'Size': '',
            'Speed': '',
            'Boosts': [],
            'Flaws': [],
            'Languages': [],
            'Specials': [],
            'URL': '',
            'LastUpdated': ''
        }
    
    }
}

module.exports ={
    Ancestry
}