import React, { useState, useEffect } from "react";
import "../css/PetContacts.css";
import AddContactButton from "./AddContactButton";
import ToggleSwitch from "./ToggleSwitch";
import { FaAngleDown, FaPlus } from "react-icons/fa";


import axios from "axios";

function PetContacts(props) {
  // const setCurrentTab = props.setCurrentTab;
  const petObjectId = props.petObjectId;
  const [serviceCompanyName, setServiceCompanyName] = useState("");
  const [serviceLocationName, setServiceLocationName] = useState("");
  const [serviceWebsite, setServiceWebsite] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [serviceCity, setServiceCity] = useState("");
  const [serviceProvince, setServiceProvince] = useState("");
  const [servicePostalCode, setServicePostalCode] = useState("");
  const [serviceEmail, setServiceEmail] = useState("");
  const [servicePhoneNumber, setServicePhoneNumber] = useState("");
  const [serviceContactFirstName, setServiceContactFirstName] = useState("");
  const [serviceContactLastName, setServiceContactLastName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [savedData, setSavedData] = useState([]); // Initialize with an empty array
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  

  const handleSubmit = () => {
    // Validate required fields before submitting
    if (!serviceCompanyName || !servicePostalCode || !serviceWebsite) {
      console.error("Please fill in all required fields");

      return;
    }
    const newData = {
      petId: petObjectId,
      serviceCompanyName,
      serviceLocationName,
      serviceWebsite,
      serviceAddress,
      serviceCity,
      serviceProvince,
      servicePostalCode,
      serviceEmail,
      servicePhoneNumber,
      serviceContactFirstName,
      serviceContactLastName,
      accountNumber,
      isActive,
      // Add more fields here as needed
    };
    console.log("summiting", newData);
    console.log("", newData);
    // Make a Put request to the backend API to save the data
    axios
      .put("/api/pets/addcontacts/648ca772f089b3a0e8ea606d", newData)
      .then((response) => {
        console.log("New pet contact saved successfully");
        console.log(response?.data);
        setSavedData([...savedData, response.data]); // Add the new pet contact to the existing list
        setIsActive(false);
        // Clear the input fields
        clearFields();
      })
      .catch((error) => {
        console.error("Error saving pet contact:", error);
      });
  };

  const clearFields = () => {
    setServiceCompanyName("");
    setServiceLocationName("");
    setServiceWebsite("");
    setServiceAddress("");
    setServiceCity("");
    setServiceProvince("");
    setServicePostalCode("");
    setServiceEmail("");
    setServicePhoneNumber("");
    setServiceContactFirstName("");
    setServiceContactLastName("");
    setAccountNumber("");
    // Clear more fields here as needed
  };

  const handleAddContact = () => {
    setIsActive(true);
    setIsExpanded(false);
  };

  const toggleSavedDataItem = (index) => {
    const updatedSavedData = savedData.map((data, i) =>
      i === index ? { ...data, isActive: !data.isActive } : data
    );
    setSavedData(updatedSavedData);
  };

  useEffect(() => {
    const fetchSavedPetContacts = async () => {
      try {
        const response = await axios.get(
          "/api/pets/648ca772f089b3a0e8ea606d/contacts"
        );
        setSavedData(response.data);
      } catch (error) {
        console.error("Error fetching pet contacts:", error);
      }
    };

    fetchSavedPetContacts();
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleExpand = (index) => {
    setExpandedItems((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#edf3f0",
        margin: "0 70px",
        border: "1px solid #ccc",
      }}
    >
      <div className="petcontainer">
        <AddContactButton onAddContact={handleAddContact} />
        <h2 style={{ paddingLeft: "50px", paddingRight: "50px" }}>Contacts</h2>

        <p style={{ paddingLeft: "50px", paddingRight: "50px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          sed lectus non mauris lacinia finibus. Fusce et est nec justo cursus
          feugiat. Suspendisse potenti. Sed ultrices, sapien ac commodo varius,
          purus nisl laoreet massa, a interdum nulla erat a mi
        </p>
      </div>

      <div className="inputcontainer">
        <div
          className="service-type"
          style={{
            backgroundColor: isActive ? "#50D9A3" : "#9f9e9e",
            padding: "5px 50px",
            color: "white",
            fontSize: "20px",
            border: "1px solid #ccc",
          }}
        >
          <h4 style={{ paddingLeft: "10px", marginBottom: "0px" }}>
            Service Type:{" "}
            <FaAngleDown
              onClick={toggleExpanded}
              style={{
                marginLeft: "600px",
                marginBottom: "-0px",
                marginTop: "-50px",
              }}
            />
          </h4>
        </div>
        <div className="feildcontainer" style={{ border: "1px solid #ccc",  }}>
          <section
            className="section-container"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginRight: "90px",
              marginLeft: "0px",
              marginTop: isActive ? "20px" : "0",
              height: isActive ? "250px" : "auto",
              transition: "height 0.3s ease-in-out",
            }}
          >
            <div className="form-group ">
              <label >Company Name*</label>
              <input
                type="text"
                value={serviceCompanyName}
                onChange={(e) => setServiceCompanyName(e.target.value)}
                required="service company is required"
              />
            </div>
            <div className="form-group">
              <label>Company Location Name</label>
              <input
                type="text"
                value={serviceLocationName}
                onChange={(e) => setServiceLocationName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            {isActive && (
              <>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>City/Town</label>
                  <input
                    type="text"
                    value={serviceCity}
                    onChange={(e) => setServiceCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Province</label>
                  <input
                    type="text"
                    value={serviceProvince}
                    onChange={(e) => setServiceProvince(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={serviceContactFirstName}
                    onChange={(e) => setServiceContactFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={serviceContactLastName}
                    onChange={(e) => setServiceContactLastName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code*</label>
                  <input
                    type="text"
                    value={servicePostalCode}
                    onChange={(e) => setServicePostalCode(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={servicePhoneNumber}
                    onChange={(e) => setServicePhoneNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={serviceEmail}
                    onChange={(e) => setServiceEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Website*</label>
                  <input
                    type="text"
                    value={serviceWebsite}
                    onChange={(e) => setServiceWebsite(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {isExpanded && (
              <>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>City/Town</label>
                  <input
                    type="text"
                    value={serviceCity}
                    onChange={(e) => setServiceCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Province</label>
                  <input
                    type="text"
                    value={serviceProvince}
                    onChange={(e) => setServiceProvince(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={serviceContactFirstName}
                    onChange={(e) => setServiceContactFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={serviceContactLastName}
                    onChange={(e) => setServiceContactLastName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code*</label>
                  <input
                    type="text"
                    value={servicePostalCode}
                    onChange={(e) => setServicePostalCode(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={servicePhoneNumber}
                    onChange={(e) => setServicePhoneNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={serviceEmail}
                    onChange={(e) => setServiceEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Website*</label>
                  <input
                    type="text"
                    value={serviceWebsite}
                    onChange={(e) => setServiceWebsite(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </section>

          <div
            className="toggle-form-group"
            style={{ marginLeft: "800px", marginTop: "65px" }}
          >
            <label style={{ paddingRight: "5px", marginBottom: "10px" }}>
              Active
            </label>
            <ToggleSwitch
              id="activateDeactiate"
              isActive={isActive}
              onToggleChange={setIsActive}
              onToggleChangeOption={setIsExpanded}
              optionValue={false}
            />
          </div>

          <div
            className="save-button"
            style={{ marginLeft: "50px", marginTop: "20px" }}
          >
            <button
              onClick={handleSubmit}
              style={{
                padding: "13px 33px",
                fontSize: "14px",
                borderRadius: "25px",
                backgroundColor: "#232f3e",
                color: "#56d97b",
                border: "1px solid #232f3e",
                borderTopWidth: "2px",
                borderLeftWidth: "2px",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#56d97b";
                e.target.style.color = "#131921";
                e.target.style.borderColor = "#56d97b";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#232f3e";
                e.target.style.color = "#56d97b";
                e.target.style.borderColor = "#232f3e";
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <div>
        {savedData && savedData.length > 0 && (
          <div
            className="saved-data-container"
            style={{
              marginTop: "30px",
              display: "flex",
              flexWrap: "wrap",
              height: "400px",
              overflow: "auto",
            }}
          >
            {savedData.map((data, index) => (
              <div
                key={index}
                className="saved-data-item"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              >
                <div
                  className="service-type"
                  style={{
                    backgroundColor: data.isActive ? "#50D9A3" : "#9f9e9e",
                    padding: "5px 50px",
                    color: "white",
                    fontSize: "20px",
                  }}
                >
                  <h5 style={{ paddingLeft: "10px", marginBottom: "10px" }}>
                    Service Type:{" "}
                    <FaPlus
                      onClick={() => toggleExpand(index)}
                      style={{ marginLeft: "420px" }}
                    />{" "}
                    Expand
                  </h5>
                </div>

                <section
                  className="section-container1"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    marginRight: "90px",
                    marginLeft: "50px",
                    marginTop: data.isActive ? "20px" : "0",
                    height: data.isActive ? "250px" : "auto",
                    transition: "height 0.3s ease-in-out",
                  }}
                >
                  <div className="form-group">
                    <label>Company Name:</label>
                    <p>{data.serviceCompanyName}</p>
                  </div>
                  <div className="form-group">
                    <label>Company Location Name:</label>
                    <p>{data.serviceLocationName}</p>
                  </div>
                  <div className="form-group">
                    <label>Account Number:</label>
                    <p>{data.accountNumber}</p>
                  </div>

                  {data.isActive && (
                    <>
                      <div className="form-group">
                        <label>Address:</label>
                        <p>{data.serviceAddress}</p>
                      </div>
                      <div className="form-group">
                        <label>City/Town:</label>
                        <p>{data.serviceCity}</p>
                      </div>
                      <div className="form-group">
                        <label>Province:</label>
                        <p>{data.serviceProvince}</p>
                      </div>
                      <div className="form-group">
                        <label>First Name:</label>
                        <p>{data.serviceContactFirstName}</p>
                      </div>
                      <div className="form-group">
                        <label>Last Name:</label>
                        <p>{data.serviceContactLastName}</p>
                      </div>
                      <div className="form-group">
                        <label>Postal Code:</label>
                        <p>{data.servicePostalCode}</p>
                      </div>
                      <div className="form-group">
                        <label>Phone:</label>
                        <p>{data.servicePhoneNumber}</p>
                      </div>
                      <div className="form-group">
                        <label>Email Address:</label>
                        <p>{data.serviceEmail}</p>
                      </div>
                      <div className="form-group">
                        <label>Website:</label>
                        <p>{data.serviceWebsite}</p>
                      </div>
                    </>
                  )}

                  {expandedItems[index] && (
                    <>
                      <div className="form-group">
                        <label>Address:</label>
                        <p>{data.serviceAddress}</p>
                      </div>
                      <div className="form-group">
                        <label>City/Town:</label>
                        <p>{data.serviceCity}</p>
                      </div>
                      <div className="form-group">
                        <label>Province:</label>
                        <p>{data.serviceProvince}</p>
                      </div>
                      <div className="form-group">
                        <label>First Name:</label>
                        <p>{data.serviceContactFirstName}</p>
                      </div>
                      <div className="form-group">
                        <label>Last Name:</label>
                        <p>{data.serviceContactLastName}</p>
                      </div>
                      <div className="form-group">
                        <label>Postal Code:</label>
                        <p>{data.servicePostalCode}</p>
                      </div>
                      <div className="form-group">
                        <label>Phone:</label>
                        <p>{data.servicePhoneNumber}</p>
                      </div>
                      <div className="form-group">
                        <label>Email Address:</label>
                        <p>{data.serviceEmail}</p>
                      </div>
                      <div className="form-group">
                        <label>Website:</label>
                        <p>{data.serviceWebsite}</p>
                      </div>
                    </>
                  )}
                </section>

                <div
                  className="activatedeactivetoggle"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <label style={{ paddingLeft: "650px", marginBottom: "10px" }}>
                    <label style={{ paddingRight: "10px" }}>Active</label>
                    <ToggleSwitch
                      id={`activateDeactiateSaved_${index}`}
                      isActive={data.isActive}
                      onToggleChange={() => toggleSavedDataItem(index)}
                      onToggleChangeOption={(value) =>
                        setExpandedItems((prevState) => {
                          const updatedState = [...prevState];
                          updatedState[index] = value;
                          return updatedState;
                        })
                      }
                      optionValue={false}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PetContacts;
