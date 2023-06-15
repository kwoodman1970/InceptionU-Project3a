import React, { useState } from "react";
import "../css/PetContacts.css";
import AddContactButton from "./AddContactButton";
import ToggleSwitch from "./ToggleSwitch";

function PetContacts() {
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
  const [savedData, setSavedData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
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
      isActive
      // Add more fields here as needed
    };
    setSavedData([...savedData, newData]);
    setIsActive(false);
    clearFields();
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
  };

  const toggleSavedDataItem = (index) => {
    const updatedSavedData = savedData.map((data, i) =>
      i === index ? { ...data, isActive: !data.isActive } : data
    );
    setSavedData(updatedSavedData);
  };

  return (
    <div main-container style={{ backgroundColor: "#edf3f0", margin: "0 70px" }}>
      <div className="petcontainer">
        <AddContactButton onAddContact={handleAddContact} />
        <h3 style={{ paddingLeft: "50px", paddingRight: "50px" }}>Contacts</h3>

        <p style={{ paddingLeft: "50px", paddingRight: "50px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          sed lectus non mauris lacinia finibus. Fusce et est nec justo cursus
          feugiat. Suspendisse potenti. Sed ultrices, sapien ac commodo varius,
          purus nisl laoreet massa, a interdum nulla erat a mi
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit} style={{}}>
          <div
            className="service-type"
            style={{
              backgroundColor: isActive ? "#50D9A3" : "#9f9e9e",
              padding: "5px 50px",
              color: "white",
              fontSize: "20px",
            }}
          >
            <h4 style={{ paddingLeft: "10px", marginBottom: "10px" }}>
              Service Type:
            </h4>
          </div>
          <section
            className="section-container"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginRight: "30px",
              marginLeft: "50px",
              marginTop: isActive ? "20px" : "0",
              height: isActive ? "400px" : "auto",
              transition: "height 0.3s ease-in-out",
            }}
          >
            <div className="form-group">
              <label>Service Company Name*</label>
              <input
                type="text"
                value={serviceCompanyName}
                onChange={(e) => setServiceCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Service Location Name</label>
              <input
                type="text"
                value={serviceLocationName}
                onChange={(e) => setServiceLocationName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Account #</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            {isActive && (
              <>
                <div className="form-group">
                  <label>Service Address</label>
                  <input
                    type="text"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Service City</label>
                  <input
                    type="text"
                    value={serviceCity}
                    onChange={(e) => setServiceCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Service Province</label>
                  <input
                    type="text"
                    value={serviceProvince}
                    onChange={(e) => setServiceProvince(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Service Contact First Name</label>
                  <input
                    type="text"
                    value={serviceContactFirstName}
                    onChange={(e) => setServiceContactFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Service Contact Last Name</label>
                  <input
                    type="text"
                    value={serviceContactLastName}
                    onChange={(e) => setServiceContactLastName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Service Postal Code*</label>
                  <input
                    type="text"
                    value={servicePostalCode}
                    onChange={(e) => setServicePostalCode(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Service Phone Number</label>
                  <input
                    type="tel"
                    value={servicePhoneNumber}
                    onChange={(e) => setServicePhoneNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Service Email</label>
                  <input
                    type="email"
                    value={serviceEmail}
                    onChange={(e) => setServiceEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Service Website*</label>
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
            style={{ marginLeft: "800px", marginTop: "20px" }}
          >
            <label style={{ paddingRight: "5px", marginBottom: "10px" }}>
              Activate/Deactivate
            </label>
            <ToggleSwitch isActive={isActive} onToggleChange={setIsActive} />
          </div>

          <div
            className="save-button"
            style={{ marginLeft: "50px", marginTop: "20px" }}
          >
            <button type="submit">Save</button>
          </div>
        </form>
      </div>

      {savedData.length > 0 && (
        <div className="saved-data-container" style={{ marginTop: "30px", display: "flex", flexWrap: "wrap" }}>
          <h3>Saved Data</h3>
          {savedData.map((data, index) => (
            <div key={index} className="saved-data-item" style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", marginRight: "10px", marginBottom: "10px" }}>
              <h4>Service Company Name: {data.serviceCompanyName}</h4>
              <p>Service Location Name: {data.serviceLocationName}</p>
              <p>Service Website: {data.serviceWebsite}</p>
              <p>Service Address: {data.serviceAddress}</p>
              <p>Service City: {data.serviceCity}</p>
              <p>Service Province: {data.serviceProvince}</p>
              <p>Service Postal Code: {data.servicePostalCode}</p>
              <p>Service Email: {data.serviceEmail}</p>
              <p>Service Phone Number: {data.servicePhoneNumber}</p>
              <p>Service Contact First Name: {data.serviceContactFirstName}</p>
              <p>Service Contact Last Name: {data.serviceContactLastName}</p>
              <p>Account Number: {data.accountNumber}</p>
              <div>
                <button onClick={() => toggleSavedDataItem(index)}>
                  {data.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
              {/* Display other saved data fields */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PetContacts;
