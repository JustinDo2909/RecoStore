const Category = require('../models/category.model')


 const getAllCategory = async (req, res) => {
    try {
      const Categorys = await Category.find({})
      if(!Categorys){
        return res.status(404).json({
            message:'can not take all Category',
            success: false
        })
      }  
      return res.status(200).json({
        message: "Category list",
        data : Categorys,
        success: true
      })
    } catch (error) {
        console.log(error)
    }
}
 const getOneCategory = async (req, res) => {
    try {
      const id = req.params.id
      console.log(id , "idd")
      const Categorys = await Category.findById(id).populate("products")
      if(!Categorys){
        return res.status(404).json({
            message:'can not take all Category',
            success: false
        })
      }  
      return res.status(200).json({
        message: "Category list",
        data : Categorys,
        success: true
      })
    } catch (error) {
        console.log(error)
    }
}
 const updateCategory = async (req, res) => {
    try {
      const id = req.params.id
      const {title , decription , products} = req.body
      const Cate = { title, decription, products };

      const Categorys = await Category.findByIdAndUpdate(id, {$set: Cate} , {new: true})
      if(!Categorys){
        return res.status(404).json({
            message:'can not update Category',
            success: false
        })
      }  
      return res.status(200).json({
        message: "Category",
        data : Categorys,
        success: true
      })
    } catch (error) {
        console.log(error)
    }
}
 const deleteCategory = async (req, res) => {
    try {
      const id = req.params.id

      const Categorys = await Category.findByIdAndDelete(id)
      if(!Categorys){
        return res.status(404).json({
            message:'can not find this Category',
            success: false
        })
      }  
      return res.status(200).json({
        message: "Category delete sucess",
        data : Categorys,
        success: true
      })
    } catch (error) {
        console.log(error)
    }
}
 const createCategory = async (req, res) => {
    try {
      const {title , decription , products} = req.body
      const Cate = { title, decription, products };
      console.log (req.body)
      const Categorys = await Category.create(Cate)
      if(!Categorys){
        return res.status(404).json({
            message:'can not add this Category',
            success: false
        })
      }  
      return res.status(200).json({
        message: "Category add sucess",
        data : Categorys,
        success: true
      })
    } catch (error) {
      if (error.code === 11000){
        return res.status(400).json({
          
          message: ` 'The Category name "${error.keyValue.name} " is already taken`
        })
      }
        console.log(error)
    }
}

module.exports = {getAllCategory , createCategory , deleteCategory , updateCategory, getOneCategory}