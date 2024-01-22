module.exports.createPost = (req, res, next) => {
    if (req.body.title == ""){
        req.flash("error", "Tiêu đề không được bỏ trống!");
        res.redirect("back");
        return;
    }
    if(req.body.title.length < 5){
        req.flash("error", "Tiêu đề phải có ít nhất 5 kí tự!");
        res.redirect("back");
        return;
    }

    next();
}