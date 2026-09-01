-- Row Level Security (RLS) Policies for AURALEARN

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION is_teacher_of_student(teacher_uuid UUID, student_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM class_members cm
    JOIN class_teachers ct ON cm.class_id = ct.class_id
    WHERE cm.student_id = student_uuid AND ct.teacher_id = teacher_uuid
  ) OR EXISTS (
    SELECT 1 FROM class_members cm
    JOIN subject_teachers st ON cm.class_id = st.class_id
    WHERE cm.student_id = student_uuid AND st.teacher_id = teacher_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_parent_of_student(parent_uuid UUID, student_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM parent_links
    WHERE parent_id = parent_uuid AND student_id = student_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Teachers can view assigned students" ON profiles
  FOR SELECT USING (is_teacher_of_student(auth.uid(), id));

CREATE POLICY "Parents can view linked student" ON profiles
  FOR SELECT USING (is_parent_of_student(auth.uid(), id));

-- Documents Policies
CREATE POLICY "Students manage own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers view documents of assigned class students" ON documents
  FOR SELECT USING (is_teacher_of_student(auth.uid(), user_id));

-- Attempts Policies
CREATE POLICY "Students manage own attempts" ON attempts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Parents view aggregate attempts of linked student" ON attempts
  FOR SELECT USING (is_parent_of_student(auth.uid(), user_id));

CREATE POLICY "Teachers view attempts of class students" ON attempts
  FOR SELECT USING (is_teacher_of_student(auth.uid(), user_id));

-- Live Requests Policies
CREATE POLICY "Students manage own live requests" ON live_requests
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Assigned teachers view and accept live requests" ON live_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM class_teachers ct
      WHERE ct.class_id = live_requests.class_id AND ct.teacher_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM subject_teachers st
      WHERE st.class_id = live_requests.class_id AND st.teacher_id = auth.uid()
    )
  );
