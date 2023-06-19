import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineAppstoreAdd,
  AiOutlineUserAdd,
  AiFillFilter,
} from 'react-icons/ai';
import { HiInformationCircle } from 'react-icons/hi';
import { IoIosNotifications } from 'react-icons/io';
import { FaUserFriends } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import { ImBlog, ImBlogger } from 'react-icons/im';
import { Button, Layout, Menu, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import Footer from './Footer';
import SupplierHeader from './SupplierHeader';
import { logoutSupplier, reset } from '../features/supplier/supplierSlice';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

const SupplierLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [supplierData, setSupplierData] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { supplier } = useSelector((state) => state.supplier);
  
  const onLogout = () => {
    dispatch(logoutSupplier());
    dispatch(reset());
    navigate('/supplier/login');
  };
  const onForgotPassword = () => {
    navigate('/forgot-password');
  };

  useEffect(() => {
    const fetchSupplier = async () => {
      const { data } = await axios.get(`/api/supplier/basic/${supplier._id}`);
      setSupplierData(data);
    };
    fetchSupplier();
  }, []);

  const supplierState = useSelector((state) => state.supplier.supplier);
  return (
    <>
      <SupplierHeader />
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={['']}
            onClick={({ key }) => {
              if (key === 'signout') {
              } else {
                navigate(key);
              }
            }}
            items={[
              {
                key: '',
                icon: <AiOutlineDashboard className='fs-4' />,
                label: 'Dashboard',
              },
              {
                key: 'Customers',
                icon: <AiOutlineUser className='fs-4' />,
                label: 'Our Pets',
                children: [
                  {
                    key: 'all-pets',
                    icon: <FaUserFriends className='fs-4' />,
                    label: 'List Pets',
                  },
                  {
                    key: 'create-pet',
                    icon: <AiOutlineUserAdd className='fs-4' />,
                    label: 'Add Pet',
                  },
                ],
              },

              {
                key: 'Pets',
                icon: <MdAdminPanelSettings className='fs-4' />,
                label: 'Pet Management',
                children: [
                  {
                    key: 'all-request',
                    icon: <AiOutlineAppstoreAdd className='fs-6' />,
                    label: 'All Requests',
                  },
                ],
              },
              {
                key: 'Blogs',
                icon: <HiInformationCircle className='fs-4' />,
                label: 'Supplier Info',
                children: [
                  {
                    key: 'blog',
                    icon: <ImBlog />,
                    label: 'Add Blog',
                  },
                  {
                    key: 'blog-list',
                    icon: <ImBlogger />,
                    label: 'Blog List',
                  },
                ],
              },
            ]}
          />
        </Sider>
        <Layout className='site-layout'>
          <Header
            className='d-flex justify-content-between align-items-center py-3 pe-4'
            style={{
              padding: 0,
              background: colorBgContainer,
            }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              },
            )}
            <div className='d-flex gap-3 align-items-center'>
              <div className='position-relative'>
                <IoIosNotifications className='fs-4' />
                <span className='badge bg-warning rounded-circle p-1 position-absolute'>
                  3
                </span>
              </div>
              <div className='d-flex flex-wrap gap-3 align-items-center dropdown '>
                <div>
                  {
                    console.log('fix default image?') ||
                  // supplierData && supplier.profile ? <img
                  //   className='rounded-circle'
                  //   src={`/public/images/avatar/${supplierData.profile[0]}`}
                  //   alt='profile'
                  //   height={50}
                  //   width={50}
                  // /> : 
                  <
                    img
                    className='rounded-circle'
                    src={`https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`}
                    alt='profile'
                    height={50}
                    width={50}
                  />}

                </div>
                <div
                  role='button'
                  id='dropdownMenuLink'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'>
                  <h5 className='mb-1 '>{supplierState.name}</h5>
                  <h6
                    style={{ fontWeight: 'normal', fontSize: '15px' }}
                    className='mb-0'>
                    {supplierState.email}
                  </h6>
                </div>

                <div
                  className='dropdown-menu'
                  aria-labelledby='dropdownMenuLink'>
                  <li
                    className='dropdown-item py-2 mb-1'
                    style={{ height: 'auto', lineHeight: '18px' }}>
                    <Button className='dropdown-item fs-6'
                            onClick={() => {
                              navigate('profile');
                            }}>
                      Profile
                    </Button>
                  </li>
                  <li
                    className='dropdown-item py-2 mb-1'
                    style={{ height: 'auto', lineHeight: '18px' }}>
                    <Button className='dropdown-item fs-6'
                            onClick={() => {
                              navigate('avatar');
                            }}>
                      Avatar
                    </Button>
                  </li>
                  <li
                    className='dropdown-item py-2 mb-1'
                    style={{ height: 'auto', lineHeight: '18px' }}>
                    <Button
                      className='dropdown-item fs-6'
                      onClick={onForgotPassword}>
                      Forgot Password
                    </Button>
                  </li>
                  <li
                    className='dropdown-item py-2 mb-1'
                    style={{ height: 'auto', lineHeight: '18px' }}>
                    <Button onClick={onLogout} className='dropdown-item fs-6'>
                      Sign Out
                    </Button>
                  </li>
                </div>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <Footer />
    </>
  );
  // <>
  //   <SupplierHeader />
  //   <Outlet />
  //   <Footer />
  // </>
};

export default SupplierLayout;
