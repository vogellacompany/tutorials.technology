package asttransformations;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;

class BindableTask {
	private String summary;

	PropertyChangeSupport pcs = new PropertyChangeSupport(this);

	public void addPropertyChangeListener(PropertyChangeListener l) {
		pcs.addPropertyChangeListener(l);
	}

	public void removePropertyChangeListener(PropertyChangeListener l) {
		pcs.removePropertyChangeListener(l);
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		pcs.firePropertyChange("summary", this.summary, this.summary=summary);
	}
}