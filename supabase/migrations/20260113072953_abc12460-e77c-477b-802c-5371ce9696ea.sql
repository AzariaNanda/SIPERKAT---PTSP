-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for asset type
CREATE TYPE public.jenis_asset AS ENUM ('kendaraan', 'ruangan');

-- Create enum for status
CREATE TYPE public.status_peminjaman AS ENUM ('Pending', 'Disetujui', 'Ditolak', 'Konflik');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create master_kendaraan table
CREATE TABLE public.master_kendaraan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_kendaraan TEXT NOT NULL,
    penempatan TEXT NOT NULL,
    no_polisi TEXT NOT NULL UNIQUE,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create master_ruangan table
CREATE TABLE public.master_ruangan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_ruangan TEXT NOT NULL,
    lokasi TEXT NOT NULL,
    kapasitas INTEGER NOT NULL DEFAULT 10,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data_peminjaman table
CREATE TABLE public.data_peminjaman (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nama_pemohon TEXT NOT NULL,
    nip TEXT NOT NULL,
    unit TEXT NOT NULL,
    email TEXT NOT NULL,
    asset_id UUID NOT NULL,
    jenis_asset jenis_asset NOT NULL,
    tgl_mulai DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    tgl_selesai DATE NOT NULL,
    jam_selesai TIME NOT NULL,
    keperluan TEXT NOT NULL,
    status status_peminjaman NOT NULL DEFAULT 'Pending',
    catatan_admin TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_kendaraan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_ruangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_peminjaman ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Create function to assign role based on email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Check email and assign role
  IF NEW.email = 'subbagumpeg.dpmptspbms@gmail.com' THEN
    user_role := 'admin';
  ELSIF NEW.email = 'dpmpptspkabbanyumas@gmail.com' THEN
    user_role := 'user';
  ELSE
    -- For unauthorized emails, we'll handle rejection in the frontend
    RETURN NEW;
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Trigger to assign role on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for master_kendaraan
CREATE POLICY "Anyone can view kendaraan"
ON public.master_kendaraan
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can insert kendaraan"
ON public.master_kendaraan
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update kendaraan"
ON public.master_kendaraan
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete kendaraan"
ON public.master_kendaraan
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for master_ruangan
CREATE POLICY "Anyone can view ruangan"
ON public.master_ruangan
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can insert ruangan"
ON public.master_ruangan
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update ruangan"
ON public.master_ruangan
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete ruangan"
ON public.master_ruangan
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for data_peminjaman
CREATE POLICY "Users can view their own peminjaman"
ON public.data_peminjaman
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own peminjaman"
ON public.data_peminjaman
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update any peminjaman"
ON public.data_peminjaman
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own pending peminjaman"
ON public.data_peminjaman
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'Pending');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_master_kendaraan_updated_at
  BEFORE UPDATE ON public.master_kendaraan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_ruangan_updated_at
  BEFORE UPDATE ON public.master_ruangan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_peminjaman_updated_at
  BEFORE UPDATE ON public.data_peminjaman
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for asset photos
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Storage policies for assets bucket
CREATE POLICY "Anyone can view asset images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Admin can upload asset images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update asset images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete asset images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));

-- Enable realtime for data_peminjaman
ALTER PUBLICATION supabase_realtime ADD TABLE public.data_peminjaman;