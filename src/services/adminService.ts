import { doc, getDoc, setDoc } from 'firebase/firestore';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';

export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(firestore, 'admins', userId));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const checkIsSuperAdmin = async (userId: string): Promise<boolean> => {
  try {
    const superAdminDoc = await getDoc(doc(firestore, 'superadmins', userId));
    return superAdminDoc.exists();
  } catch (error) {
    console.error('Error checking superadmin status:', error);
    return false;
  }
};

export const getCurrentUserSuperAdminStatus = async (): Promise<boolean> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;

  return await checkIsSuperAdmin(currentUser.uid);
};

export const getCurrentUserAdminStatus = async (): Promise<boolean> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;
  
  return await checkIsAdmin(currentUser.uid);
};

export const addAdmin = async (userId: string): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    // Verificar que el usuario actual es SuperAdmin
    const isSuperAdmin = await checkIsSuperAdmin(currentUser.uid);
    if (!isSuperAdmin) {
      console.error('Solo los SuperAdmins pueden agregar administradores');
      return false;
    }

    await setDoc(doc(firestore, 'admins', userId), {
      addedAt: new Date().toISOString(),
      addedBy: currentUser.uid
    });
    return true;
  } catch (error) {
    console.error('Error adding admin:', error);
    return false;
  }
};

export const getAllAdmins = async (): Promise<any[]> => {
  try {
    const adminsSnapshot = await getDocs(collection(firestore, 'admins'));
    return adminsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

export const removeAdmin = async (userId: string): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    // Verificar que el usuario actual es SuperAdmin
    const isSuperAdmin = await checkIsSuperAdmin(currentUser.uid);
    if (!isSuperAdmin) {
      console.error('Solo los SuperAdmins pueden eliminar administradores');
      return false;
    }

    await deleteDoc(doc(firestore, 'admins', userId));
    return true;
  } catch (error) {
    console.error('Error removing admin:', error);
    return false;
  }
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    // Verificar que el usuario actual es Admin o SuperAdmin
    const isAdmin = await checkIsAdmin(currentUser.uid);
    const isSuperAdmin = await checkIsSuperAdmin(currentUser.uid);

    if (!isAdmin && !isSuperAdmin) {
      console.error('Solo los administradores pueden eliminar reseñas');
      return false;
    }

    await deleteDoc(doc(firestore, 'reviews', reviewId));
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};