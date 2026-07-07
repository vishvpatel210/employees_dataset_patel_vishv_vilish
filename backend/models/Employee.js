const mongoose = require('mongoose');

const GeoSchema = new mongoose.Schema({
    lat: { type: String },
    long: { type: String },
    timezone: {
        name: { type: String },
        utc_offset: { type: String }
    }
}, { _id: false });

const LocationSchema = new mongoose.Schema({
    state: { type: String },
    country: { type: String },
    geo: { type: GeoSchema }
}, { _id: false });

const AddressSchema = new mongoose.Schema({
    street: { type: String },
    city: { type: String },
    location: { type: LocationSchema }
}, { _id: false });

const ContactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: { type: String, required: true },
    address: { type: AddressSchema }
}, { _id: false });

const CertificationsSchema = new mongoose.Schema({
    current: [{ type: String }],
    expired: [{ type: String }],
    meta: {
        verified: { type: Boolean, default: false },
        lastUpdated: { type: Date, default: Date.now }
    }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
    years: { type: Number, min: 0, max: 100 },
    domains: [{ type: String }],
    certifications: { type: CertificationsSchema }
}, { _id: false });

const SkillsSchema = new mongoose.Schema({
    primary: { type: String },
    secondary: [{ type: String }],
    experience: { type: ExperienceSchema }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
    contact: { type: ContactSchema, required: true },
    skills: { type: SkillsSchema },
    projects: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Project'
    }]
}, { _id: false });

const employeeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please add an employee ID'],
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    profile: {
        type: ProfileSchema,
        required: true
    },
    // Optional standard fields to retain compatibility with normal system workflows
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department'
    },
    designation: { type: String },
    salary: { type: Number },
    status: { type: String, enum: ['Active', 'Inactive', 'active', 'inactive'], default: 'Active' },
    joiningDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema, 'employee');
