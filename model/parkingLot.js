var Slot = require("./parkingSlot.js");

module.exports = function Parking(name, status){
    this.name = name;
    this.status = status;
    this.slots = [];
    this.createSlots = function(slots){
        slots.forEach(function(val){
            slots.push(new Slot(this.name, val.name, val.open))
        });
    }
}