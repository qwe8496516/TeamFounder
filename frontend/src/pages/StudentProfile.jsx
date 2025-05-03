import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'
import { Tag, Modal, Input, Select, Button } from 'antd'
import { 
  CodeOutlined, 
  ToolOutlined, 
  GlobalOutlined, 
  TeamOutlined,
  PlusOutlined
} from '@ant-design/icons'

function StudentProfile() {
  const [profile, setProfile] = useState({
    userId: '',
    username: '',
    email: '',
    skills: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [skills, setSkills] = useState([])
  const [skillType, setSkillType] = useState('')
  const [skillTypes, setSkillTypes] = useState([])
  const [isAddSkillModalVisible, setIsAddSkillModalVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const token = localStorage.getItem('token')

        if (!userId || !token) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please login first',
            confirmButtonColor: '#4f46e5'
          }).then(() => {
            navigate('/login')
          })
          return
        }
        
        const response = await axios.get(`http://localhost:8080/api/student/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        

        const mockProfile = {
          userId: userId,
          username: response.data.username,
          email: response.data.email,
          skills: response.data.skills,
          role: response.data.role
        }
        
        setProfile(mockProfile)
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load profile information',
          confirmButtonColor: '#4f46e5'
        })
      } finally {
        setIsLoading(false)
      }
    }

    const fetchSkillTypes = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:8080/api/student/profile/skills`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const skills = response.data
        const types = [...new Set(skills.map(skill => skill.type))]
        const typeSkills = skills.filter(skill => skill.type === types[0])
        setSkillTypes(types)
        setSkillType(types[0])
        setSkills(typeSkills)
        setNewSkill(typeSkills[0])
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load skill types',
          confirmButtonColor: '#4f46e5'
        })
      }
    }

    fetchProfile()
    fetchSkillTypes()
  }, [])

  useEffect(() => {
    if (!skillType) return;
    const fetchAllSkills = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/student/profile/skills`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allSkills = response.data;
      const filtered = allSkills.filter(skill => skill.type === skillType);
      setSkills(filtered);
      setNewSkill(filtered[0] || null);
    };
    fetchAllSkills();
  }, [skillType]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const userId = profile.userId;
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Passwords do not match',
            confirmButtonColor: '#4f46e5'
        });
        return;
    }
    if (password.length < 6) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Password must be at least 6 characters long',
            confirmButtonColor: '#4f46e5'
        });
        return;
    }
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            'http://localhost:8080/api/auth/change-password',
            {
                userId,
                password,
                confirmPassword
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message || 'Password updated successfully',
            confirmButtonColor: '#4f46e5'
        });
        setPassword('');
        setConfirmPassword('');
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response?.data || 'Failed to update password',
            confirmButtonColor: '#4f46e5'
        });
    }
  }

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    if (!newSkill) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a skill',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/student/profile/${id}/skills`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { skillId: newSkill.id }
        }
      );
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skills.find(skill => skill.id === newSkill.id)].sort((a, b) => a.id - b.id)
      }));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Skill added successfully',
        confirmButtonColor: '#4f46e5'
      });
      setIsAddSkillModalVisible(false);
      fetchSkillTypes();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response.data,
        confirmButtonColor: '#4f46e5'
      });
    }
  }

  const handleRemoveSkill = async (skillId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this skill?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });
    if (!result.isConfirmed) return;

    try {
      const id = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8080/api/student/profile/${id}/skills/${skillId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProfile(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill.id !== skillId)
      }));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Skill removed successfully',
        confirmButtonColor: '#4f46e5'
      });
    } catch (err) {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove skill',
        confirmButtonColor: '#4f46e5'
      });
    }
  }

  const fetchSkillTypes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:8080/api/student/profile/skills`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const skills = response.data
      const types = [...new Set(skills.map(skill => skill.type))]
      const typeSkills = skills.filter(skill => skill.type === types[0])
      setSkillTypes(types)
      setSkillType(types[0])
      setSkills(typeSkills)
      setNewSkill(typeSkills[0])
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load skill types',
        confirmButtonColor: '#4f46e5'
      })
    }
  }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-800 px-4 py-5 sm:px-6">
            <h3 className="text-2xl font-bold text-white">
              Student Profile
            </h3>
            <p className="mt-1 text-sm text-indigo-200">
              Manage your personal information and skills
            </p>
          </div>
          
          {/* Basic Information Section */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profile.userId}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profile.username}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profile.email}</dd>
              </div>
            </dl>
          </div>

          {/* Password Section */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
                <div className="flex">
                    <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                    Update Password
                    </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-black"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-black"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Skills Section */}
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Skills</h4>
              <Button 
                type="submit" 
                icon={<PlusOutlined />}
                className="bg-gray-600 hover:bg-gray-700 text-white"
                onClick={() => setIsAddSkillModalVisible(true)}
              >
                Add Skill
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => {
                  let icon = <CodeOutlined />;
                  let color = 'blue';
                  
                  switch(skill.type) {
                    case 'Programming':
                      icon = <CodeOutlined />;
                      color = 'blue';
                      break;
                    case 'Tool':
                      icon = <TeamOutlined />;
                      color = 'green';
                      break;
                    case 'Language':
                      icon = <GlobalOutlined />;
                      color = 'purple';
                      break;
                    case 'Framework':
                      icon = <ToolOutlined />;
                      color = 'orange';
                      break;
                    default:
                      icon = <ToolOutlined />;
                      color = 'black';
                  }

                  return (
                    <Tag
                      key={skill.id}
                      icon={icon}
                      color={color}
                      closable
                      onClose={() => handleRemoveSkill(skill.id)}
                      className="flex items-center gap-1"
                    >
                      {skill.name}
                    </Tag>
                  );
                })
              ) : (
                <div className="text-center py-4 w-full">
                  <p className="text-sm text-gray-500">No skills added yet</p>
                </div>
              )}
            </div>

            <Modal
              title="Add New Skill"
              open={isAddSkillModalVisible}
              onCancel={() => setIsAddSkillModalVisible(false)}
              footer={null}
            >
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Type</label>
                  <Select
                    value={skillType}
                    onChange={(value) => setSkillType(value)}
                    className="w-full"
                  >
                    {skillTypes.map((type) => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                  <Select
                    value={newSkill?.id}
                    onChange={id => setNewSkill(skills.find(s => s.id === id))}
                    className="w-full"
                  >
                    {skills.map((skill) => (
                      <Select.Option key={skill.id} value={skill.id}>
                        {skill.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                  onClick={() => setIsAddSkillModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={handleAddSkill}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                    disabled={!newSkill}
                  >
                    Add
                  </Button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile 