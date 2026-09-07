"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./client";
import type { StaffMember } from "@/src/lib/types";
import { STAFF_ROLES, ROLE_LABELS, type Role } from "@/src/lib/rbac";

function roleToTitle(role: string): StaffMember["role"] {
  const norm = role.toLowerCase().replace(/[\s-]/g, "_");
  switch (norm) {
    case "super_admin":
    case "superadmin":
    case "admin":
      return "Super Admin";
    case "store_manager":
      return "Store Manager";
    case "order_manager":
      return "Order Manager";
    case "inventory_manager":
      return "Inventory Manager";
    case "marketing_manager":
      return "Marketing Manager";
    case "customer_support":
      return "Customer Support";
    case "finance_viewer":
      return "Finance Viewer";
    default:
      return "Store Manager";
  }
}

export function titleToRoleKey(title: string): Role {
  const norm = title.toLowerCase().replace(/[\s-]/g, "_");
  if (norm.includes("super") || norm === "admin") return "super_admin";
  if (norm.includes("store")) return "store_manager";
  if (norm.includes("order")) return "order_manager";
  if (norm.includes("inventory")) return "inventory_manager";
  if (norm.includes("marketing")) return "marketing_manager";
  if (norm.includes("support")) return "customer_support";
  if (norm.includes("finance")) return "finance_viewer";
  return "store_manager";
}

function toStaffMember(id: string, raw: DocumentData): StaffMember {
  const name =
    typeof raw.name === "string"
      ? raw.name
      : typeof raw.displayName === "string"
        ? raw.displayName
        : (typeof raw.email === "string" ? raw.email.split("@")[0] : "Staff Member");
  const email = typeof raw.email === "string" ? raw.email : "";
  const roleStr = typeof raw.role === "string" ? raw.role : "Store Manager";

  return {
    id,
    name,
    email,
    avatar:
      typeof raw.photoURL === "string" && raw.photoURL
        ? raw.photoURL
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD8EA&color=FF4FA3&size=160`,
    role: roleToTitle(roleStr),
    lastActive: typeof raw.lastActive === "string" ? raw.lastActive : (raw.lastLoginAt ? "Recently" : "Active"),
    status: (raw.status ?? "Active") as StaffMember["status"],
    createdAt:
      raw.createdAt?.toDate?.()?.toISOString?.().split("T")[0] ??
      (typeof raw.createdAt === "string" ? raw.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]),
  };
}

export function useStaff(): { staff: StaffMember[]; loading: boolean } {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to users collection and staff collection
    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (usersSnap) => {
        const staffMap = new Map<string, StaffMember>();

        // Check users collection for staff/admin roles
        for (const d of usersSnap.docs) {
          const data = d.data();
          const roleStr = (typeof data.role === "string" ? data.role : "").toLowerCase();
          const isStaffRole =
            STAFF_ROLES.includes(roleStr as any) ||
            roleStr === "admin" ||
            roleStr.includes("manager") ||
            roleStr.includes("support");

          if (isStaffRole) {
            staffMap.set(d.id, toStaffMember(d.id, data));
          }
        }

        // Also merge standalone staff collection
        getDocs(collection(db, "staff"))
          .then((staffSnap) => {
            for (const d of staffSnap.docs) {
              const data = d.data();
              if (!staffMap.has(d.id)) {
                staffMap.set(d.id, toStaffMember(d.id, data));
              }
            }
            setStaff(Array.from(staffMap.values()));
            setLoading(false);
          })
          .catch(() => {
            setStaff(Array.from(staffMap.values()));
            setLoading(false);
          });
      },
      (err) => {
        console.warn("[staff] Real-time users listener error:", err);
        setLoading(false);
      }
    );

    return () => unsubUsers();
  }, []);

  return { staff, loading };
}

export async function inviteOrAddStaffInDB(member: {
  name: string;
  email: string;
  role: StaffMember["role"];
}): Promise<string> {
  const id = `st-${Date.now()}`;
  const roleKey = titleToRoleKey(member.role);

  // Write to staff collection
  await setDoc(doc(db, "staff", id), {
    id,
    name: member.name,
    email: member.email.toLowerCase().trim(),
    role: member.role,
    roleKey,
    status: "Active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // If a user account already exists with this email, update their role in users collection too!
  try {
    const q = query(collection(db, "users"), where("email", "==", member.email.toLowerCase().trim()));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await updateDoc(doc(db, "users", d.id), {
        role: roleKey,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (_) {
    /* non-blocking */
  }

  return id;
}

export async function updateStaffRoleInDB(id: string, role: StaffMember["role"]): Promise<void> {
  const roleKey = titleToRoleKey(role);
  try {
    await updateDoc(doc(db, "staff", id), {
      role,
      roleKey,
      updatedAt: serverTimestamp(),
    });
  } catch (_) {}

  try {
    await updateDoc(doc(db, "users", id), {
      role: roleKey,
      updatedAt: serverTimestamp(),
    });
  } catch (_) {}
}

export async function removeStaffInDB(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "staff", id));
  } catch (_) {}
  try {
    await updateDoc(doc(db, "users", id), {
      role: "customer",
      updatedAt: serverTimestamp(),
    });
  } catch (_) {}
}
