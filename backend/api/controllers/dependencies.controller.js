import DependenciesDAO from "../../dao/dependenciesDAO.js"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId





export default class DependenciesController {

    static async apiGetDependencies(req, res, next) {
        const requestsPerPage = req.query.requestsPerPage ? parseInt(req.query.requestsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query._id) {
            filters._id = ObjectId(req.query._id)
        } else if (req.query.StartCoursesname) {
            filters.StartCoursesname = req.query.StartCoursesname
        } else if (req.query.EndCoursesname) {
            filters.EndCoursesname = req.query.EndCoursesname
        }

        const { requestsList, totalNumRequestsList } = await RequestsDAO.getRequests({
            filters,
            page,
            requestsPerPage,
        })

        let response = {
            requests: requestsList,
            page: page,
            filters: filters,
            entries_per_page: requestsPerPage,
            total_results: totalNumRequestsList,
        }
        res.json(response)
    }

    static async apiPostDependencies(req, res, next) {
        try {
            const StartCoursesname = req.body.StartCoursesname
            const EndCoursesname = req.body.EndCoursesname
            const DependenciesResponse = await DependenciesDAO.postDependencies(
                StartCoursesname,
                EndCoursesname,
            )
            console.log("DependenciesResponse", DependenciesResponse)
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

}