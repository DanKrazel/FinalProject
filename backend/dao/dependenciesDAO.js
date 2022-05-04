import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let requests

export default class DependenciesDAO {
    static async injectDB(conn) {
        if (dependencies) {
            return
        }
        try {
            dependencies = await conn.db(process.env.RESTREVIEWS_NS).collection("dependencies")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in requestsDAO: ${e}`,
            )
        }
    }
    static async getDependencies({ filters = null, page = 0, DependenciesPerPage = 20 } = {}) {
        let query
        if (filters) {
            if ("_id" in filters) {
                query = { "_id": { $eq: filters["_id"] } }
            } else if ("StartCoursesname" in filters) {
                query = { "StartCoursesname": { $eq: filters["StartCoursesname"] } }
            } else if ("EndCoursesname" in filters) {
                query = { "EndCoursesname": { $eq: filters["EndCoursesname"] } }
            } 
        }

        let cursor

        try {
            cursor = await dependencies.find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { requestsList: [], totalNumRequestsList: 0 }
        }

        const displayCursor = cursor.limit(DependenciesPerPage).skip(DependenciesPerPage * page)

        try {
            const requestsList = await displayCursor.toArray()
            const totalNumRequestsList = await dependencies.countDocuments(query)

            return { requestsList, totalNumRequestsList }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { requestsList: [], totalNumRequestsList: 0 }
        }
    }
    static async postDependencies(StartCoursesname, EndCoursesname) {
        try {
            const dependenciesDoc = {
                StartCoursesname: StartCoursesname,
                EndCoursesname: EndCoursesname,
            }
            return await dependencies.insertOne(dependenciesDoc)
        } catch (e) {
            console.error(`Unable to post request: ${e}`)
            return { error: e }
        }
    }
    static async findDependencies(id, StartCoursesname, EndCoursesname) {
        try {
            const requestsDoc = {
                id: id,
                StartCoursesname: StartCoursesname,
                EndCoursesname: EndCoursesname
            }
            let query = {
                "_id": { $eq: _id },
                "StartCoursesname": { $eq: StartCoursesname },
                "EndCoursesname": { $eq: EndCoursesname },
            }
            return await requests.findOne(query)
        } catch (error) {
            console.error(`Unable to find request: ${e}`)
            return { error: e }
        }
    }
}