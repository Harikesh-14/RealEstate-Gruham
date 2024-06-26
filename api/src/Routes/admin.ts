import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";

import adminModel from "../../models/admin";
import vendorModel from "../../models/vendor";
import productModel from "../../models/products";

dotenv.config();
const router = Router();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY as string;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
})
const uploadMiddleware = multer({ storage });

router.use(cookieParser());

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, gender, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await adminModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, salt);
    const newAdmin = await adminModel.create({
      firstName,
      lastName,
      gender,
      email,
      phoneNumber,
      password: hashedPassword,
    })

    res.status(201).json({
      message: "Admin registered successfully",
      data: newAdmin,
    })
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body

  const isExistingUser = await adminModel.findOne({ email });

  if (!isExistingUser) {
    return res.status(400).json({ message: "User not found" });
  }

  const passOk = bcrypt.compareSync(password, isExistingUser.password);

  if (!passOk) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const tokenPayload = {
    id: isExistingUser._id,
    firstName: isExistingUser.firstName,
    lastName: isExistingUser.lastName,
    gender: isExistingUser.gender,
    email: isExistingUser.email,
    phoneNumber: isExistingUser.phoneNumber,
    message: "Admin logged in successfully",
  }

  try {
    const token = jwt.sign(tokenPayload, secret, {})
    res.cookie("token", token, { httpOnly: true, secure: true }).json(tokenPayload);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})

router.get("/auth-status", (req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(200).json({ authenticated: false });
  }

  jwt.verify(token, secret, {}, (err, decoded) => {
    if (err) {
      return res.status(200).json({ authenticated: false });
    }
    res.status(200).json({ authenticated: true, user: decoded });
  });
});

router.get("/profile", (req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(info)
  })
})

router.post("/logout", async (req: Request, res: Response) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

router.put("/update-firstName", async (req: Request, res: Response) => {
  const { firstName } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const info = decoded as JwtPayload;
      const updatedAdmin = await adminModel.findByIdAndUpdate(info.id, { firstName }, { new: true });

      if (!updatedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      return res.status(200).json({ message: 'First name updated successfully', updatedAdmin });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.put("/update-lastName", async (req: Request, res: Response) => {
  const { lastName } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const info = decoded as JwtPayload;
      const updatedAdmin = await adminModel.findByIdAndUpdate(info.id, { lastName }, { new: true });

      if (!updatedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      return res.status(200).json({ message: 'Last name updated successfully', updatedAdmin });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.put("/update-gender", async (req: Request, res: Response) => {
  const { gender } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const info = decoded as JwtPayload;
      const updatedAdmin = await adminModel.findByIdAndUpdate(info.id, { gender }, { new: true });

      if (!updatedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      return res.status(200).json({ message: 'Last name updated successfully', updatedAdmin });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.put("/update-email", async (req: Request, res: Response) => {
  const { email } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const info = decoded as JwtPayload;
      const updatedAdmin = await adminModel.findByIdAndUpdate(info.id, { email }, { new: true });

      if (!updatedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      return res.status(200).json({ message: 'Email updated successfully', updatedAdmin });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.put("/update-phoneNumber", async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const info = decoded as JwtPayload;
      const updatedAdmin = await adminModel.findByIdAndUpdate(info.id, { phoneNumber }, { new: true });

      if (!updatedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      return res.status(200).json({ message: 'Phone number updated successfully', updatedAdmin });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.put("/update-password", async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const info = decoded as JwtPayload;
      const admin = await adminModel.findById(info.id);

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Verify the old password before updating
      const isOldPasswordValid = bcrypt.compareSync(oldPassword, admin.password);
      if (!isOldPasswordValid) {
        return res.status(400).json({ error: 'Invalid old password' });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      admin.password = hashedPassword;

      await admin.save(); // Use save to update the document

      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.post("/add-vendor", async (req: Request, res: Response) => {
  const { firstName, lastName, gender, email, phoneNumber, password } = req.body;
  const { token } = req.cookies;

  try{
    const existingVendor = await vendorModel.findOne({ email })

    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    jwt.verify(token, secret, {}, async (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (typeof decoded === 'object' && 'id' in decoded) {
        const { id } = decoded as CustomJwtPayload;

        const hashedPassword = bcrypt.hashSync(password, salt);
        const newVendor = await vendorModel.create({
          firstName,
          lastName,
          gender,
          email,
          phoneNumber,
          password: hashedPassword,
          author: id,
        });

        res.status(201).json({
          message: "Vendor added successfully",
          data: newVendor,
        });
      }
    })
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})

router.get("/view-vendors", async (req: Request, res: Response) => {
  try {
    const vendors = await vendorModel.find()
    res.status(200).json(vendors)
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})

router.delete("/delete-vendor/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedVendor = await vendorModel.findByIdAndDelete(id);

    if (!deletedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})

router.post("/add-product", uploadMiddleware.single('productImage'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File not found' });
    }

    const { filename } = file
    const productImage = `uploads/${filename}`

    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, secret, {}, async (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (typeof decoded === 'object' && 'id' in decoded) {
        const { id } = decoded as CustomJwtPayload;
        
        const { productName, productPrice, productCategory, productDescription } = req.body;

        try {
          const newProduct = await productModel.create({
            productName,
            productPrice,
            productCategory,
            productDescription,
            productImage,
            author: id,
          });

          res.status(201).json({
            message: "Product added successfully",
            data: newProduct,
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/view-products", async (req: Request, res: Response) => {
  try {
    const products = await productModel.find()
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})

router.delete("/delete-product/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})

router.get("/checkAdminLoginAuth", (req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(200).json({ authenticated: false });
  }

  jwt.verify(token, secret, {}, (err, decoded) => {
    if (err) {
      return res.status(200).json({ authenticated: false });
    }
    res.status(200).json({ authenticated: true, user: decoded });
  });
})

export default router;