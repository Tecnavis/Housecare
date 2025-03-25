const mongoose = require("mongoose");
const Benificiaries = require("./model/benificiary");

// Replace with your MongoDB connection string
const connectionString = "mongodb+srv://narjishakuniyil:e7eEAKgbyxLzh3AG@housecare.243sss4.mongodb.net/?retryWrites=true&w=majority&appName=housecare";

// Connect to your database
mongoose.connect(connectionString)
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Fetch all benificiaries sorted by creation date
      const benificiaries = await Benificiaries.find({}).sort({ createdAt: 1 });

      for (let i = 0; i < benificiaries.length; i++) {
        const beneficiary = benificiaries[i];

        // Check for required fields and set defaults if needed
        if (!beneficiary.age) beneficiary.age = 0; // or any default value
        if (!beneficiary.category) beneficiary.category = "Unknown"; // or any default value

        const newId = `BENF${(i + 1).toString().padStart(5, "0")}`;
        beneficiary.beneficiary_id = newId;

        // Save each updated beneficiary
        await beneficiary.save();
        console.log(`Updated beneficiary ${beneficiary._id} with ID ${newId}`);
      }

      console.log("All existing benificiaries have been updated with unique IDs");
    } catch (err) {
      console.error("Error updating benificiaries", err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
