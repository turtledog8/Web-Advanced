import statusCodes from "http-status-codes";
import * as data from "../data/data.js";


export function getAllFabrics(req, res) {
    const allFabrics = data.getAllFabrics()
    res.status(statusCodes.OK).json(allFabrics);

}
export function getFabricById(res, req) {
    const comicBookById = findFabricsById(req.params.fabricId);
    return res.status(statusCodes.OK).json(comicBookById);
}

export function postFabric(req,res) {
    const comicBook = req.body;
    data.postFabric(comicBook);
    return res.status(statusCodes.CREATED).json(comicBook);
}
function findFabricsById(fabricId) {
    const fabric = data.getFabricById(fabricId);
    if (!fabric) {
        throw {
            status: statusCodes.NOT_FOUND,
            message: `Fabric with id ${fabricId} not found`};
    }
    return fabric;
}

export function putFabrics(req, res) {
    const fabric = findFabricsById(req.params.fabricId);
    const updatedFabric = {
        fabricId: fabric.fabricId,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        usage: req.body.usage,
        image: req.body.image
    };
    try {
        const updatedFabricData = data.putUpdatedFabric(updatedFabric);
        return res.status(statusCodes.OK).json(updatedFabricData);
    } catch (error) {
        return res.status(error.status || statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

export function deleteFabric(req,res) {
    const comicBook = findFabricsById(req.params.fabricId);
    data.deleteBidById(comicBook.fabricId);
    data.deleteBidsForFabricById(comicBook.fabricId)
    return res.status(statusCodes.NO_CONTENT).json();
}
function findFabricById(fabricId) {
    const fabric = data.getFabricById(fabricId);
    if (!fabric) {
        throw {
            status: statusCodes.NOT_FOUND,
            message: `fabric with id ${fabricId} not found`};
    }
    return fabricId;
}













    // export function createFabric(newFabric) {
    //     const fabricId = Fabrics.length + 1;
    //     const fabricWithBids = {
    //         ...newFabric,
    //         fabricId,
    //         bids: []
    //     };
    //     Fabrics.push(fabricWithBids);
    //     fs.writeFileSync('./data/jsonFiles/json-data.json', JSON.stringify({
    //         fabrics: Fabrics
    //     }, null, 2));
    //     return fabricWithBids;
    // }
    //
    // export function updateFabricById (fabricId, updatedFabric) {
    //     const index = Fabrics.findIndex(fabric => fabric.fabricId === fabricId);
    //     if (index !== -1) {
    //         Fabrics[index] = { ...Fabrics[index], ...updatedFabric, fabricId };
    //         fs.writeFileSync('./data/jsonFiles/json-data.json', JSON.stringify({
    //             fabrics: Fabrics
    //         }, null, 2));
    //         return Fabrics[index];
    //     } else {
    //         throw {
    //             status: statusCodes.NOT_FOUND,
    //             message: `Fabric with ID ${fabricId} not found`
    //         };
    //     }
    // }
    //

    // export function deleteFabricById(fabricId) {
    //     const index = Fabrics.findIndex(fabric => fabric.fabricId === fabricId);
    //     if (index !== -1) {
    //         Fabrics.splice(index, 1);
    //         fs.writeFileSync('./data/jsonFiles/json-data.json', JSON.stringify({
    //             fabrics: Fabrics
    //         }, null, 2));
    //         return { message: `Fabric with ID ${fabricId} deleted successfully` };
    //     } else {
    //         throw {
    //             status: statusCodes.NOT_FOUND,
    //             message: `Fabric with ID ${fabricId} not found`
    //         };
    //     }
    // }

    // export function getAllBidsForFabric(fabricId) {
    //     const fabric = Fabrics.find(fabric => fabric.fabricId === fabricId);
    //     if (fabric && fabric.bids) {
    //         return fabric.bids;
    //     } else {
    //         throw {
    //             status: statusCodes.NOT_FOUND,
    //             message: `Bids for Fabric with ID ${fabricId} not found`
    //         };
    //     }
    // }
