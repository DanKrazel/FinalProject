import DependenciesDAO from "../../dao/dependenciesDAO.js"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId


export default class DependenciesController {

    static async apiGetDependencies(req, res, next) {
        const dependenciesPerPage = req.query.dependenciesPerPage ? parseInt(req.query.dependenciesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query._id) {
            filters._id = ObjectId(req.query._id)
        } else if (req.query.DepensencieID) {
            filters.DepensencieID = req.query.DepensencieID
        } else if (req.query.StartCoursesname) {
            filters.StartCoursesname = req.query.StartCoursesname
        } else if (req.query.EndCoursesname) {
            filters.EndCoursesname = req.query.EndCoursesname
        }

        const { dependenciesList, totalNumdependenciesList } = await DependenciesDAO.getDependencies({
            filters,
            page,
            dependenciesPerPage,
        })

        let response = {
            dependencies: dependenciesList,
            page: page,
            filters: filters,
            entries_per_page: dependenciesPerPage,
            total_results: totalNumdependenciesList,
        }
        console.log(response)
        res.json(response)
    }

    static async apiPostDependencies(req, res, next) {
        console.log("apiPostDependencies");
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

    static async apiDeleteDependencies(req, res, next) {
        try {
          const id = req.query.id
          console.log(id)
    
          const DeleteResponse = await DependenciesDAO.deleteDependencies(
            id
          )
          console.log(DeleteResponse)
          res.json({ status: "success" })
        } catch (e) {
          res.status(500).json({ error: e.message })
        }
      }

}