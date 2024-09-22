import slugify from "slugify"
import Category from "../models/CategorySchema.js"

const createCategory = async(req,res)=>{
    try {
        const {name} = req.body 
        if(!name){
            return res.status(401).json({
                success:false,
                message:"Name is required"
            })
        }
    
        const existingCategory = await Category.findOne({name})
        if(existingCategory){
            return res.status(400).json({
                success:false,
                message:"Category already exist"
            })
        }
    
        const category =await new Category({name,slug:slugify(name)}).save() 
    
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
            category
        })
        
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message:"Falied to create category",
            success:false,
            error
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        // Fix 1: Changed the status code to 400 (Bad Request) instead of 401
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true } // No change needed here, this is correct
        );

        // Fix 2: Added curly braces {} around the if block
        if (!category) {
            return res.status(404).json({
                message: "Category does not exist",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.log(error);
        
        // Fix 3: Changed the status code to 500 (Internal Server Error) instead of 404
        return res.status(500).json({
            success: false,
            message: "Failed to update the category",
            error
        });
    }
};


const getAllCategory  = async(req,res)=>{
    try {
        const category = await Category.find()

        return res.status(200).json({
            message:"Fatched all the category",
            success:true,
            category
        })
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message:"Failed to get all categories",
            success:false,
            error
        })
    }
}

const singleCategory = async(req,res) =>{
    try {
        const slug = req.params.slug;
        
        const category = await Category.findOne({slug});
        console.log(slug);
        
        if(!category){
            res.status(404).json({
                message:"The category does not exist",
                success:false,
            })
        }
        res.status(200).json({
            message:"Get single category successfully",
            success: true,
            category
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message:"Failed to get single category",
            success:false,
            error
        })
    }
}

const deleteCategory = async(req,res) =>{
    try {
        const id = req.params.id;
        await Category.findByIdAndDelete(id)
        res.status(200).json({
            message: "Category deleted succesfully",
            success: false
        })
    } catch (error) {
        res.status(404).json({
            message:"Failed to delete category",
            success: true,
            error
        })
    }
}

export {
    createCategory,
    updateCategory,
    getAllCategory,
    singleCategory,
    deleteCategory
}