import { useContext, useEffect, useState } from "react"
import { BiSolidPencil } from "react-icons/bi"
import { CgPassword } from "react-icons/cg"
import { CiUser } from "react-icons/ci"
import { Link, Navigate } from "react-router-dom"
import { AdminContext } from "../context/adminContext"
import { MdDone } from "react-icons/md"

function AdminDashboard() {
  const { adminLoggedIn } = useContext(AdminContext)!

  const [firstName, setFirstName] = useState(adminLoggedIn.firstName);
  const [lastName, setLastName] = useState(adminLoggedIn.lastName);
  const [gender, setGender] = useState(adminLoggedIn.gender);
  const [email, setEmail] = useState(adminLoggedIn.email);
  const [phoneNumber, setPhoneNumber] = useState(adminLoggedIn.phoneNumber);

  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editGender, setEditGender] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhoneNumber, setEditPhoneNumber] = useState(false);

  const [redirect, setRedirect] = useState(false)

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setFirstName(adminLoggedIn.firstName);
    setLastName(adminLoggedIn.lastName);
    setGender(adminLoggedIn.gender);
    setEmail(adminLoggedIn.email);
    setPhoneNumber(adminLoggedIn.phoneNumber);
  }, [adminLoggedIn]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/checkAdminLoginAuth', {
          method: 'GET',
          credentials: 'include',
        })

        const data = await response.json()

        if (!data.authenticated) {
          setRedirect(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    checkAuthStatus()
  }, [])

  const handleFirstNameUpdateClick = async () => {
    try {
      await fetch('http://localhost:3000/admin/update-firstName', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
        }),
      })
    } catch (err) {
      console.error(err)
    }
    setEditFirstName(false);
    alert('First name updated successfully\nPlease logout and login again to see changes');
  };

  const handleLastNameUpdateClick = async () => {
    try {
      await fetch('http://localhost:3000/admin/update-lastName', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastName: lastName,
        }),
      })
    } catch (err) {
      console.error(err)
    }
    setEditLastName(false);
    alert('Last name updated successfully\nPlease logout and login again to see changes');
  };

  const handleGenderUpdateClick = async () => {
    try {
      await fetch('http://localhost:3000/admin/update-gender', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender: gender.toLowerCase(),
        }),
      })
    } catch (err) {
      console.error(err)
    }
    setEditGender(false);
    alert('Last name updated successfully\nPlease logout and login again to see changes');
  };

  const handleEmailUpdateClick = async () => {
    try {
      await fetch('http://localhost:3000/admin/update-email', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      })
    } catch (err) {
      console.error(err)
    }
    setEditEmail(false);
    alert('Email updated successfully\nPlease logout and login again to see changes');
  };

  const handlePhoneNumberUpdateClick = async () => {
    try {
      await fetch('http://localhost:3000/admin/update-phoneNumber', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
        }),
      })
    } catch (err) {
      console.error(err)
    }
    setEditPhoneNumber(false);
    alert('Phone number updated successfully\nPlease logout and login again to see changes');
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/admin/update-password', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'An error occurred');
        return;
      }

      alert('Password updated successfully\nPlease logout and login again to see changes');
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred');
    }
  };

  if (redirect) {
    return <Navigate to="/admin/login" />
  }

  return (
    <div className="md:ml-[20rem] p-10 bg-gray-100">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
      <div className="my-7 bg-white border-b border-gray-300">
        <div className="py-4">
          <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-gray-800 px-3">
            Profile
            <CiUser />
          </h2>
        </div>
        <div className="flex justify-between items-center p-3 md:p-5 md:px-10">
          <label
            className="w-[74%] md:w-[15%] text-gray-800 font-semibold text-md md:text-lg"
          >First Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={!editFirstName}
          />
          {editFirstName ? (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={handleFirstNameUpdateClick}
            >
              <MdDone />
            </Link>
          ) : (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={() => setEditFirstName(true)}
            >
              <BiSolidPencil />
            </Link>
          )}
        </div>

        <div className="flex justify-between items-center p-3 md:p-5 md:px-10">
          <label
            className="w-[74%] md:w-[15%] text-gray-800 font-semibold text-md md:text-lg"
          >Last Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={!editLastName}
          />
          {editLastName ? (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={handleLastNameUpdateClick}
            >
              <MdDone />
            </Link>
          ) : (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={() => setEditLastName(true)}
            >
              <BiSolidPencil />
            </Link>
          )}
        </div>

        <div className="flex justify-between items-center p-3 md:p-5 md:px-10">
          <label
            className="w-[74%] md:w-[15%] text-gray-800 font-semibold text-md md:text-lg"
          >Gender</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={gender}
            onChange={e => setGender(e.target.value)}
            disabled={!editGender}
          />
          {editGender ? (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={handleGenderUpdateClick}
            >
              <MdDone />
            </Link>
          ) : (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={() => setEditGender(true)}
            >
              <BiSolidPencil />
            </Link>
          )}
        </div>

        <div className="flex justify-between items-center p-3 md:p-5 md:px-10">
          <label
            className="w-[74%] md:w-[15%] text-gray-800 font-semibold text-md md:text-lg"
          >Email</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!editEmail}
          />
          {editEmail ? (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={handleEmailUpdateClick}
            >
              <MdDone />
            </Link>
          ) : (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={() => setEditEmail(true)}
            >
              <BiSolidPencil />
            </Link>
          )}
        </div>

        <div className="flex justify-between items-center p-3 md:p-5 md:px-10">
          <label
            className="w-[74%] md:w-[15%] text-gray-800 font-semibold text-md md:text-lg"
          >Phone Number</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={phoneNumber}
            onChange={e => setPhoneNumber(parseInt(e.target.value))}
            disabled={!editPhoneNumber}
          />
          {editPhoneNumber ? (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={handlePhoneNumberUpdateClick}
            >
              <MdDone />
            </Link>
          ) : (
            <Link
              to={'#'}
              className="bg-blue-500 text-white font-semibold text-sm md:text-lg ml-2 p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
              onClick={() => setEditPhoneNumber(true)}
            >
              <BiSolidPencil />
            </Link>
          )}
        </div>
      </div>

      <div className="my-7 bg-white border-b border-gray-300">
        <div className="py-4">
          <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-gray-800 px-3">
            Change Password
            <CgPassword />
          </h2>
        </div>
        <div className="flex justify-between items-center p-3 md:p-5 md:px-10">
          <label className="w-[74%] md:w-[15%] text-gray-800 font-semibold text-md md:text-lg">
            Old Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center p-3 md:p-5 md:px-10">
          <label className="w-[74%] md:w-[15%] text-gray-800 font-semibold text-md md:text-lg">
            New Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center p-3 md:p-5 md:px-10">
          <label className="w-[74%] md:w-[15%] text-gray-800 font-semibold text-md md:text-lg">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-center items-center p-3 md:p-5 md:px-10">
          <button
            className="bg-blue-500 text-white font-semibold text-md md:text-lg p-3 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
            onClick={changePassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard