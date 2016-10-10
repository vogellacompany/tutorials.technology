
package test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Date;


public class DaoMySQL {
	private Connection connect = null;
	private Statement statement = null;
	private ResultSet resultSet = null;
	
	public DaoMySQL() throws Exception {
		try {

			Class.forName("com.mysql.jdbc.Driver").newInstance();
			connect = DriverManager
					.getConnection("jdbc:mysql://localhost/feedback?"
							+ "user=sqluser&password=sqluserpw");
			PreparedStatement statement = connect
					.prepareStatement("SELECT myuser, webpage, datum, summary, COMMENTS from FEEDBACK.COMMENTS");

			resultSet = statement.executeQuery();
			while (resultSet.next()) {
				String user = resultSet.getString("myuser");
				String website = resultSet.getString("webpage");
				String summary = resultSet.getString("summary");
				Date date = resultSet.getDate("datum");
				String comment = resultSet.getString("comments");
				System.out.println("User: " + user);
				System.out.println("Website: " + website);
				System.out.println("Summary: " + summary);
				System.out.println("Date: " + date);
				System.out.println("Comment: " + comment);
			}
		} catch (Exception e) {
			throw e;
		} finally {
			close();
		}

	}


	private void close() {
		try {
			if (resultSet != null) {
				resultSet.close();
			}

			if (statement != null) {
				statement.close();
			}

			if (connect != null) {
				connect.close();
			}
		} catch (Exception e) {

		}
	}
	
	public static void main(String[] args) throws Exception {
		DaoMySQL dao = new DaoMySQL();
	}

}
