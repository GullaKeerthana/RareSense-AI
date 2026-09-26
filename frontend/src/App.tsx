import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Assistant from './pages/Assistant'
import SymptomChecker from './pages/SymptomChecker'
import KnowledgeHub from './pages/KnowledgeHub'
import KnowledgeDetail from './pages/KnowledgeDetail'
import SchemeFinder from './pages/SchemeFinder'
import SchemeDetail from './pages/SchemeDetail'
import NgoDirectory from './pages/NgoDirectory'
import NgoDetail from './pages/NgoDetail'
import HospitalFinder from './pages/HospitalFinder'
import HospitalDetail from './pages/HospitalDetail'
import DoctorFinder from './pages/DoctorFinder'
import ReportAnalyzer from './pages/ReportAnalyzer'
import CareNavigator from './pages/CareNavigator'
import EmergencySOS from './pages/EmergencySOS'
import AdminDashboard from './pages/AdminDashboard'
import AdminHospitals from './pages/AdminHospitals'
import AdminKnowledge from './pages/AdminKnowledge'
import AdminSchemes from './pages/AdminSchemes'
import AdminNgos from './pages/AdminNgos'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/knowledge-hub" element={<KnowledgeHub />} />
        <Route path="/knowledge-hub/:id" element={<KnowledgeDetail />} />
        <Route path="/schemes" element={<SchemeFinder />} />
        <Route path="/schemes/:id" element={<SchemeDetail />} />
        <Route path="/ngos" element={<NgoDirectory />} />
        <Route path="/ngos/:id" element={<NgoDetail />} />
        <Route path="/hospitals" element={<HospitalFinder />} />
        <Route path="/hospitals/:id" element={<HospitalDetail />} />
        <Route path="/doctors" element={<DoctorFinder />} />
        <Route path="/sos" element={<EmergencySOS />} />
        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <Assistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/symptom-checker"
          element={
            <ProtectedRoute>
              <SymptomChecker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/care-navigator"
          element={
            <ProtectedRoute>
              <CareNavigator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/hospitals"
          element={
            <AdminRoute>
              <AdminHospitals />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/knowledge-hub"
          element={
            <AdminRoute>
              <AdminKnowledge />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/schemes"
          element={
            <AdminRoute>
              <AdminSchemes />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/ngos"
          element={
            <AdminRoute>
              <AdminNgos />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
