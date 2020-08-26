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

class Creature {
    lastScraped = '';
    constructor(){
        this.Name = '';
        this.Level = {
            Type: '',
            Level: ''
        };
        this.Traits = {
            Rarity: '',
            Alignment: '',
            Size: '',
            OtherTraits: [],
        };
        this.Source = '';
        this.Perception = {
            Modifier: '',
            SpecialSenses: []
        };
        this.Languages = [];
        this.Skills = [];
        this.AbilityModifiers = {
            Str: '',
            Dex: '',
            Con: '',
            Int: '',
            Wis: '',
            Cha: ''
        };
        this.Items = [];
        this.InteractionAbilities = [];
        this.AC = [];
        this.SavingThrows = {
            Fort: '',
            Ref: '',
            Will: '', 
            Extra: []
        };
        this.HP = '';
        this.Immunities = [];
        this.Weaknesses = [];
        this.Resistances = [];
        this.AutomaticAbilities =[{
            Name: '',
            Traits: [],
            Description: ''
        }];
        this.ReactiveAbilities =[{
            Name: '',
            Type: '',
            Traits: [],
            Description: ''
        }];
        this.Speed = {
            Speeds: [{
                Type: '',
                Distance: ''
            }],
            SpecialAbilities: []
        };
        this.Melee = [];
        this.Ranged = [];
        this.Spells = [];
        this.InnateSpells = [];
        this.FocusSpells = [];
        this.Rituals = [];
        this.ProactiveAbilities= [];
    }
}

module.exports ={
    Ancestry,
    Creature
}