const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers', 'employeeController.js');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('getPaginationData')) {
    content = content.replace('const getUpdatePayload =', `const getPaginationData = (page, limit, total) => {
    const pagination = {};
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }
    return pagination;
};

const getUpdatePayload =`);
}

const replacements = [
    {
        name: 'getEmployeesByCountry',
        param: 'country',
        filter: "{ 'profile.contact.address.location.country': new RegExp(country, 'i') }"
    },
    {
        name: 'getEmployeesByState',
        param: 'state',
        filter: "{ 'profile.contact.address.location.state': new RegExp(state, 'i') }"
    },
    {
        name: 'getEmployeesByPrimarySkill',
        param: 'skill',
        filter: "{ 'profile.skills.primary': new RegExp(skill, 'i') }"
    },
    {
        name: 'getEmployeesByDomain',
        param: 'domain',
        filter: "{ 'profile.skills.experience.domains': new RegExp(domain, 'i') }"
    },
    {
        name: 'getVerifiedEmployees',
        noParam: true,
        filter: "{ 'profile.skills.experience.certifications.meta.verified': true }"
    },
    {
        name: 'getRecentCertifications',
        noParam: true,
        isSort: true,
        filter: "{}",
        sort: "{ 'profile.skills.experience.certifications.meta.lastUpdated': -1 }"
    },
    {
        name: 'getEmployeeProjects',
        noParam: true,
        filter: "{ 'profile.projects': { $exists: true, $not: { $size: 0 } } }",
        populate: "populate('profile.projects')"
    }
];

replacements.forEach(r => {
    const regex = new RegExp(`exports\\.${r.name} = async \\(req, res, next\\) => \\{\\s*try \\{[\\s\\S]*?\\}\\s*catch \\(err\\) \\{\\s*next\\(err\\);\\s*\\}\\s*\\};`);
    
    let replacement = `exports.${r.name} = async (req, res, next) => {
    try {
        ${r.noParam ? '' : `const ${r.param} = req.params.${r.param};`}
        const queryFilter = ${r.filter};
        const total = await Employee.countDocuments(queryFilter);
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || ${r.name === 'getEmployeeProjects' ? 20 : 10};
        const startIndex = (page - 1) * limit;

        const queryObj = Employee.find(queryFilter)${r.sort ? `.sort(${r.sort})` : ''};
        const employees = await populateEmployee(queryObj)${r.populate ? `.${r.populate}` : ''}.skip(startIndex).limit(limit);

        res.status(200).json({
            success: true,
            count: employees.length,
            pagination: getPaginationData(page, limit, total),
            data: employees
        });
    } catch (err) {
        next(err);
    }
};`;

    content = content.replace(regex, replacement);
});

const tasksRegex = new RegExp(`exports\\.getEmployeeTasks = async \\(req, res, next\\) => \\{\\s*try \\{[\\s\\S]*?\\}\\s*catch \\(err\\) \\{\\s*next\\(err\\);\\s*\\}\\s*\\};`);
const tasksReplacement = `exports.getEmployeeTasks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        const pipeline = [
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'assignedTo',
                    as: 'tasks'
                }
            },
            {
                $match: {
                    'tasks.0': { $exists: true }
                }
            }
        ];

        const countResult = await Employee.aggregate([...pipeline, { $count: 'total' }]);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        const employeesWithTasks = await Employee.aggregate([
            ...pipeline,
            { $skip: startIndex },
            { $limit: limit }
        ]);

        res.status(200).json({ 
            success: true, 
            count: employeesWithTasks.length, 
            pagination: getPaginationData(page, limit, total),
            data: employeesWithTasks 
        });
    } catch (err) {
        next(err);
    }
};`;

content = content.replace(tasksRegex, tasksReplacement);

fs.writeFileSync(file, content);
console.log('Refactoring successful.');
