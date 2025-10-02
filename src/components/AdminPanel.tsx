import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Users, Trash2, AlertTriangle, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCurrentUserAdminStatus, getCurrentUserSuperAdminStatus, addAdmin, getAllAdmins, removeAdmin } from '../services/adminService';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  darkMode: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ darkMode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    setLoading(true);
    const superAdminStatus = await getCurrentUserSuperAdminStatus();
    const adminStatus = await getCurrentUserAdminStatus();
    setIsSuperAdmin(superAdminStatus);
    setIsAdmin(adminStatus || superAdminStatus);
    if (adminStatus || superAdminStatus) {
      loadAdminUsers();
    }
    setLoading(false);
  };

  const loadAdminUsers = async () => {
    const admins = await getAllAdmins();
    setAdminUsers(admins);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    if (!isSuperAdmin) {
      toast.error('Solo los SuperAdmins pueden agregar administradores');
      return;
    }

    const success = await addAdmin(newAdminEmail);

    if (success) {
      toast.success('Administrador agregado exitosamente');
      setNewAdminEmail('');
      loadAdminUsers();
    } else {
      toast.error('Error al agregar administrador');
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!isSuperAdmin) {
      toast.error('Solo los SuperAdmins pueden eliminar administradores');
      return;
    }

    if (userId === auth.currentUser?.uid) {
      toast.error('No puedes eliminarte a ti mismo como administrador');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este administrador?')) {
      const success = await removeAdmin(userId);
      if (success) {
        toast.success('Administrador eliminado exitosamente');
        loadAdminUsers();
      } else {
        toast.error('Error al eliminar administrador');
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUid(text);
      toast.success('UID copiado al portapapeles');
      setTimeout(() => setCopiedUid(null), 2000);
    } catch (error) {
      toast.error('Error al copiar UID');
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Verificando permisos...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`text-center py-12 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">Acceso Denegado</h3>
        <p>No tienes permisos de administrador para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Shield className={`w-6 h-6 md:w-8 md:h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <h2 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Panel de Administración
            </h2>
          </div>
          {isSuperAdmin && (
            <span className="px-2 md:px-3 py-1 text-xs md:text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold shadow-lg w-fit">
              SUPERADMIN
            </span>
          )}
        </div>
        <p className={`text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Gestiona usuarios administradores y modera el contenido de la plataforma
        </p>
      </motion.div>

      {/* Información del usuario actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg ${
          isSuperAdmin
            ? darkMode ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300'
            : darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className={`text-sm md:text-base font-medium ${
              isSuperAdmin
                ? darkMode ? 'text-yellow-300' : 'text-yellow-800'
                : darkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>
              Tu UID de {isSuperAdmin ? 'SuperAdmin' : 'administrador'}
            </h3>
            <p className={`text-xs md:text-sm mt-1 ${
              isSuperAdmin
                ? darkMode ? 'text-yellow-400' : 'text-yellow-700'
                : darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {isSuperAdmin ? 'Tienes permisos completos para gestionar administradores' : 'Puedes moderar contenido de la plataforma'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className={`px-2 md:px-3 py-1.5 md:py-2 rounded text-xs md:text-sm font-mono break-all ${
              darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
            }`}>
              {auth.currentUser?.uid}
            </code>
            <button
              onClick={() => copyToClipboard(auth.currentUser?.uid || '')}
              className={`p-1.5 md:p-2 rounded flex-shrink-0 ${
                copiedUid === auth.currentUser?.uid
                  ? darkMode ? 'bg-green-700 text-green-300' : 'bg-green-100 text-green-600'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors`}
            >
              {copiedUid === auth.currentUser?.uid ? <Check size={14} className="md:w-4 md:h-4" /> : <Copy size={14} className="md:w-4 md:h-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      {isSuperAdmin && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Agregar Administrador */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 md:p-6 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <UserPlus className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h3 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Agregar Administrador
            </h3>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-3 md:space-y-4">
            <div>
              <label className={`block text-xs md:text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                UID del Usuario
              </label>
              <input
                type="text"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm md:text-base ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                placeholder="Ingresa el UID del usuario"
                required
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                El usuario debe estar registrado en la plataforma
              </p>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 md:py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              Agregar Administrador
            </button>
          </form>
        </motion.div>

        {/* Lista de Administradores */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 md:p-6 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Users className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
            <h3 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Administradores Actuales
            </h3>
          </div>

          <div className="space-y-2 md:space-y-3 max-h-64 overflow-y-auto">
            {adminUsers.map((admin) => (
              <div
                key={admin.id}
                className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className={`font-medium text-xs md:text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {admin.id}
                    </p>
                    <button
                      onClick={() => copyToClipboard(admin.id)}
                      className={`p-1 rounded flex-shrink-0 ${
                        copiedUid === admin.id
                          ? darkMode ? 'bg-green-700 text-green-300' : 'bg-green-100 text-green-600'
                          : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      } transition-colors`}
                    >
                      {copiedUid === admin.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Agregado: {new Date(admin.addedAt).toLocaleDateString()}
                  </p>
                  {admin.id === auth.currentUser?.uid && (
                    <span className="inline-block px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs bg-blue-500 text-white rounded-full mt-1">
                      Tú
                    </span>
                  )}
                </div>
                {admin.id !== auth.currentUser?.uid && (
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                      darkMode
                        ? 'text-red-400 hover:bg-red-900/30'
                        : 'text-red-500 hover:bg-red-50'
                    } transition-colors`}
                    title="Eliminar administrador"
                  >
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                )}
              </div>
            ))}

            {adminUsers.length === 0 && (
              <p className={`text-center py-4 text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay administradores registrados
              </p>
            )}
          </div>
        </motion.div>
      </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mt-4 md:mt-6 p-3 md:p-4 rounded-lg ${
          darkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
        }`}
      >
        <div className="flex items-start gap-2 md:gap-3">
          <AlertTriangle className={`w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0 ${
            darkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`} />
          <div>
            <h4 className={`text-sm md:text-base font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
              Información Importante
            </h4>
            <ul className={`text-xs md:text-sm mt-1 space-y-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
              <li>• Los administradores pueden eliminar cualquier tema o mensaje en los foros</li>
              <li>• Los administradores pueden eliminar cualquier reseña de profesores</li>
              {isSuperAdmin && (
                <>
                  <li>• Solo los SuperAdmins pueden agregar o eliminar administradores</li>
                  <li>• Solo agrega usuarios de confianza como administradores</li>
                  <li>• Para agregar un administrador, necesitas su UID exacto</li>
                </>
              )}
              <li>• El usuario debe estar registrado en la plataforma</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;