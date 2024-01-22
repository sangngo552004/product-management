module.exports = (limitItems, query, count) => {
    const objPagination = {
        currentPage : 1,
        limitItems : limitItems
    }
    

    if(query.page) {
        objPagination.currentPage = parseInt(query.page);
    }

    objPagination.totalPage = Math.ceil(count/objPagination.limitItems);

    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitItems;

    return objPagination;
}