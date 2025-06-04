import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Link to="/admin/users/create">
            <Button variant="secondary">Create User</Button>
          </Link>
          <Link to="/admin/tasks/create">
            <Button>Create Task</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Tasks">
          <div className="text-3xl font-bold">0</div>
          <p className="text-gray-500">Total tasks</p>
        </Card>
        
        <Card title="Users">
          <div className="text-3xl font-bold">0</div>
          <p className="text-gray-500">Registered users</p>
        </Card>
        
        <Card title="Completed">
          <div className="text-3xl font-bold">0</div>
          <p className="text-gray-500">Completed tasks</p>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard